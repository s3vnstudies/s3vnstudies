import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { db } from '../server/db.js';
import { articles } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Get the directory name using ES modules pattern
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    console.log('Processing rebranded articles...');
    
    const rootDir = path.resolve(__dirname, '..');
    const articlesDir = path.join(rootDir, 'temp/extracted_articles');
    const publicImagesDir = path.join(rootDir, 'public/images/articles/self-help');
    
    // Ensure the public images directory exists
    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }
    
    // Get all markdown files
    const mdFiles = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
    
    for (const mdFile of mdFiles) {
      const filePath = path.join(articlesDir, mdFile);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse front matter
      const { data, content } = matter(fileContent);
      
      // Set default category if not specified
      const category = data.category || 'Self-Help';

      // Create a slug from the title
      const slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      // Check for related image files
      const fileBaseName = path.basename(mdFile, '.md');
      const possibleImageNames = [
        `${fileBaseName}.jpg`,
        `${fileBaseName.toLowerCase()}.jpg`,
        `${fileBaseName.toLowerCase().replace(/_/g, '-')}.jpg`,
        fileBaseName.toLowerCase().replace('_s3vn-rebrand', '') + '-graphic.jpg',
        fileBaseName.toLowerCase().replace('-s3vn-rebrand', '') + '-graphic.jpg'
      ];
      
      // Find matching image
      let imageFile = null;
      for (const imgName of possibleImageNames) {
        const imgPath = path.join(articlesDir, imgName);
        if (fs.existsSync(imgPath)) {
          imageFile = imgName;
          break;
        }
      }
      
      // Process the content
      let processedContent = content;
      
      // Replace image references
      if (imageFile) {
        // Copy the image file to public directory if it exists
        const destImagePath = path.join(publicImagesDir, imageFile);
        fs.copyFileSync(path.join(articlesDir, imageFile), destImagePath);
        
        // Update image references in the content
        const imageUrl = `/images/articles/self-help/${imageFile}`;
        processedContent = processedContent.replace(
          new RegExp(`\\!\\[.*?\\]\\(${imageFile}\\)`, 'g'),
          `![${data.title || 'Image'}](${imageUrl})`
        );
      }
      
      // Convert premium flag to membership tier
      const membershipRequired = data.premium === true ? 'pro' : 'free';
      
      // Extract an excerpt from the content
      let excerpt = '';
      const firstParagraphMatch = processedContent.match(/(?:\r?\n|^)([^\r\n]+)(?:\r?\n|$)/);
      if (firstParagraphMatch && firstParagraphMatch[1]) {
        excerpt = firstParagraphMatch[1].replace(/[#>*_]/g, '').trim();
        if (excerpt.length > 200) {
          excerpt = excerpt.substring(0, 197) + '...';
        }
      } else {
        // Fallback excerpt
        excerpt = `${data.title || 'Article'} from the S3VN Studies library.`;
      }
      
      // Check if article with same title already exists
      const existingArticles = await db.select().from(articles).where(eq(articles.title, data.title));
      
      if (existingArticles.length > 0) {
        console.log(`Article "${data.title}" already exists, updating...`);
        
        await db.update(articles)
          .set({
            content: processedContent,
            author: data.author || 'S3VN Studies Editorial Team',
            thumbnail: data.thumbnail || `/images/articles/self-help/${imageFile}`,
            images: imageFile ? [`/images/articles/self-help/${imageFile}`] : [],
            excerpt,
            category,
            membershipRequired
          })
          .where(eq(articles.title, data.title));
      } else {
        console.log(`Inserting new article: "${data.title}"`);
        
        // Insert the article into the database
        await db.insert(articles).values({
          title: data.title,
          content: processedContent,
          author: data.author || 'S3VN Studies Editorial Team',
          thumbnail: data.thumbnail || (imageFile ? `/images/articles/self-help/${imageFile}` : null),
          images: imageFile ? [`/images/articles/self-help/${imageFile}`] : [],
          excerpt,
          category,
          membershipRequired
        });
      }
    }
    
    console.log('Finished processing rebranded articles!');
  } catch (error) {
    console.error('Error processing articles:', error);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});