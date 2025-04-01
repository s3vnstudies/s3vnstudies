import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Mail, UserPlus, LogIn } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().optional(),
});

// Password reset request schema
const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Password reset schema
const passwordResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  userId: z.string().min(1, "User ID is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot-password">("login");
  const [resetStep, setResetStep] = useState<"request" | "reset">("request");
  const [resetToken, setResetToken] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const { user, loginMutation, registerMutation, requestPasswordResetMutation, resetPasswordMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Set page title
  useEffect(() => {
    document.title = "Sign In - S3vn Studies";
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";
      navigate(redirectTo);
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      displayName: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  // Handle registration form submission
  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <div 
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center" 
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <span className="text-white font-poppins font-bold text-lg">S7</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register" | "forgot-password")}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your S3vn Studies account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username or Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                <Input placeholder="Enter your username or email" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center">
                    <div className="mb-2">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab("forgot-password");
                        }}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <div>
                      Don't have an account?{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab("register");
                        }}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Register now
                      </a>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Join the S3vn Studies community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                <Input placeholder="Choose a username" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              This will be your unique identifier on the platform
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                <Input placeholder="Enter your email" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name (Optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                <Input placeholder="How you want to be known" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              This is how you'll appear to other members
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                <Input
                                  type="password"
                                  placeholder="Create a password"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Must be at least 6 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center">
                    Already have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("login");
                      }}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Sign in
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="forgot-password">
              <Card>
                <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>
                    {resetStep === "request"
                      ? "Enter your email to receive a password reset link"
                      : "Enter your new password"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {resetStep === "request" ? (
                    // Password reset request form
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="pl-10"
                            value={
                              (document.getElementById("reset-email") as HTMLInputElement)?.value || ""
                            }
                            id="reset-email"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="w-full bg-primary hover:bg-primary-dark"
                        disabled={requestPasswordResetMutation.isPending}
                        onClick={() => {
                          const email = (document.getElementById("reset-email") as HTMLInputElement)?.value;
                          if (!email) return;
                          
                          requestPasswordResetMutation.mutate({ email }, {
                            onSuccess: (data) => {
                              if (data.token && data.userId) {
                                setResetToken(data.token);
                                setUserId(data.userId);
                                setResetStep("reset");
                              }
                            }
                          });
                        }}
                      >
                        {requestPasswordResetMutation.isPending 
                          ? "Sending request..." 
                          : "Send Reset Link"}
                      </Button>
                    </div>
                  ) : (
                    // Password reset form
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormLabel>New Password</FormLabel>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                          <Input
                            type="password"
                            placeholder="Enter your new password"
                            className="pl-10"
                            id="new-password"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Confirm Password</FormLabel>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                          <Input
                            type="password"
                            placeholder="Confirm your new password"
                            className="pl-10"
                            id="confirm-password"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="w-full bg-primary hover:bg-primary-dark"
                        disabled={resetPasswordMutation.isPending}
                        onClick={() => {
                          const newPassword = (document.getElementById("new-password") as HTMLInputElement)?.value;
                          const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement)?.value;
                          
                          if (!newPassword || !confirmPassword) return;
                          if (newPassword !== confirmPassword) {
                            alert("Passwords do not match");
                            return;
                          }
                          
                          if (!resetToken || !userId) {
                            alert("Invalid reset token or user ID");
                            return;
                          }
                          
                          resetPasswordMutation.mutate({
                            token: resetToken,
                            userId,
                            newPassword
                          }, {
                            onSuccess: () => {
                              setActiveTab("login");
                            }
                          });
                        }}
                      >
                        {resetPasswordMutation.isPending 
                          ? "Resetting password..." 
                          : "Reset Password"}
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("login");
                      }}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Back to Sign In
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-sm text-neutral-600">
            <p>
              By continuing, you agree to our{" "}
              <a href="/policies" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/policies" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-primary">
        <div className="flex flex-col justify-center px-12 w-full max-w-xl mx-auto text-white">
          <h1 className="text-3xl sm:text-4xl font-bold font-poppins mb-4">
            Join the S3vn Studies Community
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Connect with like-minded individuals, access exclusive content, and embark on a journey of continuous learning and growth.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 7 17l-5-5" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Premium Content</h3>
                <p className="opacity-80">
                  Get access to exclusive articles, videos, and educational resources
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 7 17l-5-5" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Community Features</h3>
                <p className="opacity-80">
                  Join chat rooms, participate in discussions, and connect with other members
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 7 17l-5-5" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Exclusive Benefits</h3>
                <p className="opacity-80">
                  Store discounts, early access to new content, and special member events
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-8 opacity-20" />

          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
              alt="Community member"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="italic opacity-90">
                "Joining S3vn Studies was one of the best decisions I've made for my personal growth journey."
              </p>
              <p className="text-sm mt-1 font-medium">— Sarah J., Pro Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
