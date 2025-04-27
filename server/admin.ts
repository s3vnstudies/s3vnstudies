import express, { Express, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage } from './storage';
import { registerAdminRoutes } from './admin-routes';
import AdmZip from 'adm-zip';
import { promisify } from 'util';
import { InsertArticle } from '@shared/schema';
import matter from 'gray-matter';
import { marked } from 'marked';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create DOMPurify instance with JSDOM
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Setup multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: function (req, file, cb) {
    // Only accept zip files
    if (file.mimetype !== 'application/zip' && !file.originalname.endsWith('.zip')) {
      return cb(new Error('Only zip files are allowed!'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 50, // Limit to 50MB
  }
});

// Middleware to check if user is admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
}

export function setupAdmin(app: Express) {
  // Admin-only routes
  const adminRoutes = express.Router();
  adminRoutes.use(requireAdmin);

  // Upload article zip file
  adminRoutes.post('/articles/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const zipFilePath = req.file.path;
      const extractPath = path.join(process.cwd(), 'uploads', 'extracted-' + Date.now());
      
      // Ensure the extract directory exists
      if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath, { recursive: true });
      }

      // Extract zip file
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(extractPath, true);

      // Process extracted files
      const files = await processExtractedFiles(extractPath);
      
      // Clean up
      await promisify(fs.rm)(zipFilePath, { force: true });
      await promisify(fs.rm)(extractPath, { recursive: true, force: true });

      res.json({ 
        message: 'Articles successfully imported', 
        articlesImported: files.success.length,
        errors: files.errors
      });
    } catch (error) {
      console.error('Error processing article upload:', error);
      res.status(500).json({ 
        message: 'Error processing file upload', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  app.use('/api/admin', adminRoutes);
  
  // Register moderation routes
  registerAdminRoutes(app);
}

// Define result types
interface ProcessingError {
  file: string;
  error: string;
}

interface ProcessingResults {
  success: string[];
  errors: ProcessingError[];
}

// Function to process extracted files
async function processExtractedFiles(extractPath: string): Promise<ProcessingResults> {
  const results: ProcessingResults = { success: [], errors: [] };
  
  // Recursively get all files from directory
  const getFiles = async (dir: string): Promise<string[]> => {
    const dirents = await promisify(fs.readdir)(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : [res];
    }));
    return Array.prototype.concat(...files);
  };

  try {
    const files = await getFiles(extractPath);
    
    // Process each file
    for (const file of files) {
      try {
        const extension = path.extname(file).toLowerCase();
        
        // Only process markdown or HTML files
        if (extension !== '.md' && extension !== '.html') {
          continue;
        }
        
        const fileContent = await promisify(fs.readFile)(file, 'utf8');
        
        // Parse frontmatter and content
        const { data, content } = matter(fileContent);
        
        // Convert markdown to HTML if it's a markdown file
        let processedContent = content;
        if (extension === '.md') {
          processedContent = marked.parse(content) as string;
        }
        
        // Sanitize HTML content
        const sanitizedContent = DOMPurify.sanitize(processedContent);
        
        // Extract image files from the same directory (if any)
        const fileDir = path.dirname(file);
        const imageFiles = await promisify(fs.readdir)(fileDir);
        const images = imageFiles
          .filter(img => ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(path.extname(img).toLowerCase()))
          .map(img => `/images/articles/${data.category}/${img}`);
        
        // Create article object
        const article: InsertArticle = {
          title: data.title || path.basename(file, extension),
          content: sanitizedContent,
          author: data.author || 'S3vn Studies Team',
          excerpt: data.excerpt || content.substring(0, 150) + '...',
          category: data.category || 'uncategorized',
          thumbnail: data.thumbnail || (images.length > 0 ? images[0] : null),
          images: data.images || images,
          membershipRequired: data.membershipRequired || 'free'
        };
        
        // Save article to database
        await storage.createArticle(article);
        results.success.push(file);
      } catch (error) {
        results.errors.push({
          file,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  } catch (error) {
    console.error('Error processing files:', error);
  }
  
  return results;
}