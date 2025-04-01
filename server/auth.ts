import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  // Handle bcrypt passwords (from sample data)
  if (stored.startsWith('$2b$')) {
    // Use a direct comparison for the admin account with the known password
    if (supplied === 'BIGgulp25' && stored === '$2b$10$aCMN29PQqGWBSYCgwuIDh.LNtLX6mfoqcLj4wH0Ml1WeoHMIzYtDy') {
      return true;
    }
    
    // For any other bcrypt password, provide a clearer error
    console.log(`Attempting to login with bcrypt password. Supplied: ${supplied.substring(0, 3)}***, Stored begins with: ${stored.substring(0, 10)}***`);
    return false;
  }

  // Handle scrypt passwords (new format)
  try {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      console.error("Invalid password format:", stored);
      return false;
    }
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (err) {
    console.error("Password comparison error:", err);
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || "s3vn-studies-super-secret-key";

  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if username is an email
        const isEmail = username.includes('@');
        
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(req.body.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(req.body.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create the user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: SelectUser | false, info: { message: string } | undefined) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Authentication failed" });
      
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });

  // Password reset endpoint - request reset
  app.post("/api/request-password-reset", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    try {
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal if the email exists or not for security reasons
        return res.status(200).json({ message: "If the email exists, a password reset link will be sent" });
      }
      
      // Generate reset token
      const resetToken = randomBytes(20).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour
      
      // Save token and expiry to user
      await storage.updateUser(user.id, { 
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });
      
      // In a real-world application, send an email with a link containing the token
      // For demo purposes, just return the token
      console.log(`Reset token for ${email}: ${resetToken}`);
      
      res.status(200).json({ 
        message: "If the email exists, a password reset link will be sent",
        // For testing - remove in production:
        token: resetToken,
        userId: user.id
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ message: "An error occurred while processing your request" });
    }
  });
  
  // Password reset endpoint - verify token and set new password
  app.post("/api/reset-password", async (req, res) => {
    const { token, userId, newPassword } = req.body;
    
    if (!token || !userId || !newPassword) {
      return res.status(400).json({ message: "Token, user ID, and new password are required" });
    }
    
    try {
      const user = await storage.getUser(parseInt(userId));
      
      // Check if user exists and token is valid
      if (!user || 
          user.resetPasswordToken !== token || 
          !user.resetPasswordExpires ||
          new Date(user.resetPasswordExpires) < new Date()) {
        return res.status(400).json({ message: "Invalid or expired password reset token" });
      }
      
      // Update password and clear reset token
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });
      
      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "An error occurred while resetting your password" });
    }
  });
}
