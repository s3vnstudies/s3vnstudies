// Script to process all article formats and update the database
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import pg from 'pg';
const { Pool } = pg;

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const execPromise = promisify(exec);

// Setup PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Process each category's articles
async function main() {
  console.log('Starting article processing...');
  
  // Create directories if they don't exist
  await execPromise('mkdir -p temp/meditation_articles');
  await execPromise('mkdir -p temp/self-confidence');
  await execPromise('mkdir -p temp/self-help');
  await execPromise('mkdir -p temp/time-management');
  await execPromise('mkdir -p temp/self-defeating');
  await execPromise('mkdir -p temp/health');
  await execPromise('mkdir -p temp/vitamins');
  await execPromise('mkdir -p temp/finances');
  await execPromise('mkdir -p temp/miscellaneous');
  await execPromise('mkdir -p temp/motorhomes');
  
  try {
    // Extract ZIP files if they haven't been extracted yet
    console.log('Extracting ZIP files...');
    
    // Meditation articles
    try {
      await stat('temp/meditation_articles/Meditation Articles');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/Meditation Articles.zip" -d temp/meditation_articles');
    }
    
    // Self-confidence articles
    try {
      await stat('temp/self-confidence/SelfConfidencePLRArticlesPack');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/SelfConfidencePLRArticlesPack.zip" -d temp/self-confidence');
    }
    
    // Self-help articles
    try {
      await stat('temp/self-help/SelfHelpPLRArticlesPack');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/SelfHelpPLRArticlesPack.zip" -d temp/self-help');
    }
    
    // Time management articles
    try {
      await stat('temp/time-management/TimeManagementPLRArticlesPackV2');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/TimeManagementPLRArticlesPackV2.zip" -d temp/time-management');
    }
    
    // Self-defeating articles
    try {
      await stat('temp/self-defeating/SelfDefeatingPLRArticlesPack');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/SelfDefeatingPLRArticlesPack.zip" -d temp/self-defeating');
    }
    
    // Health articles
    try {
      await stat('temp/health/MedicinesandHealthcarePLRArticlesPack');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/MedicinesandHealthcarePLRArticlesPack.zip" -d temp/health');
    }
    
    // Vitamins articles
    try {
      await stat('temp/vitamins/VitaminsandSupplementsPLRArticlesPack');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/VitaminsandSupplementsPLRArticlesPack.zip" -d temp/vitamins');
    }
    
    // Personal Finance articles
    try {
      await stat('temp/finances/Unrestricted-PLR-Articles-Personal-Finance');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/Unrestricted-PLR-Articles-Personal-Finance.zip" -d temp/finances');
    }
    
    // Miscellaneous articles
    try {
      await stat('temp/miscellaneous/MiscellaneousPLRArticlesPack');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/MiscellaneousPLRArticlesPack.zip" -d temp/miscellaneous');
    }
    
    // Motorhomes articles
    try {
      await stat('temp/motorhomes/MotorHomesPLRArticlesPack');
    } catch (e) {
      await execPromise('unzip -o "attached_assets/MotorHomesPLRArticlesPack.zip" -d temp/motorhomes');
    }

    // Create output directories
    console.log('Creating output directories...');
    await execPromise('mkdir -p uploads/articles/meditation');
    await execPromise('mkdir -p uploads/articles/self-confidence');
    await execPromise('mkdir -p uploads/articles/self-help');
    await execPromise('mkdir -p uploads/articles/time-management');
    await execPromise('mkdir -p uploads/articles/self-defeating');
    await execPromise('mkdir -p uploads/articles/health');
    await execPromise('mkdir -p uploads/articles/vitamins');
    await execPromise('mkdir -p uploads/articles/finances');
    await execPromise('mkdir -p uploads/articles/miscellaneous');
    await execPromise('mkdir -p uploads/articles/motorhomes');
    
    // Run text article conversion script
    console.log('Converting text articles...');
    await execPromise('node scripts/convert-articles.js');
    
    // Run DOC conversion script (antiword is already installed as system dependency)
    console.log('Converting DOC/DOCX articles...');
    await execPromise('node scripts/convert-doc-articles.js');
    
    // Now update the database (mark one article per category as free, others as pro)
    console.log('Updating database...');
    await updateDatabaseWithArticles();
    
    console.log('All article processing completed!');
  } catch (error) {
    console.error('Error processing articles:', error);
  }
}

// Update database with generated article markdown files
async function updateDatabaseWithArticles() {
  try {
    const categories = [
      'meditation',
      'self-confidence',
      'self-help',
      'time-management',
      'self-defeating',
      'health',
      'vitamins',
      'finances',
      'miscellaneous',
      'motorhomes'
    ];
    
    for (const category of categories) {
      console.log(`Processing ${category} articles for database...`);
      
      const dirPath = `uploads/articles/${category}`;
      const files = await readdir(dirPath);
      
      // Get Markdown files only
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
      if (mdFiles.length === 0) {
        console.log(`No markdown files found in ${dirPath}`);
        continue;
      }
      
      // Sort files alphabetically to ensure consistent free article selection
      mdFiles.sort();
      
      // Process each file in the category
      for (let i = 0; i < mdFiles.length; i++) {
        const file = mdFiles[i];
        const filePath = path.join(dirPath, file);
        
        // Check if article already exists in database by filename
        const { rows } = await pool.query(
          'SELECT id FROM articles WHERE title = $1 AND category = $2',
          [getTitle(filePath), category]
        );
        
        if (rows.length > 0) {
          console.log(`Article "${getTitle(filePath)}" already exists in database, skipping...`);
          continue;
        }
        
        // First article in each category will be free, rest are pro
        const membershipRequired = i === 0 ? 'free' : 'pro';
        
        // Extract article data from markdown file
        const { title, content, author, excerpt } = await parseMarkdownFile(filePath);
        
        // Insert article into database
        await pool.query(
          `INSERT INTO articles (
            title, content, author, excerpt, category, membership_required
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [title, content, author, excerpt, category, membershipRequired]
        );
        
        console.log(`Added article: "${title}" (${membershipRequired})`);
      }
    }
    
    console.log('Database update completed.');
  } catch (error) {
    console.error('Error updating database:', error);
  }
}

// Extract title from markdown file path
function getTitle(filePath) {
  const fileName = path.basename(filePath, '.md');
  return fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Parse markdown file to extract frontmatter and content
async function parseMarkdownFile(filePath) {
  const content = await readFile(filePath, 'utf8');
  
  // Simple frontmatter parser
  const frontmatterRegex = /---\n([\s\S]*?)\n---\n([\s\S]*)/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error(`Invalid markdown format in ${filePath}`);
  }
  
  const [, frontmatter, articleContent] = match;
  
  // Parse frontmatter
  const frontmatterLines = frontmatter.split('\n');
  const data = {};
  
  frontmatterLines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      
      data[key.trim()] = value;
    }
  });
  
  return {
    title: data.title || getTitle(filePath),
    content: articleContent.trim(),
    author: data.author || 'S3vn Studies Team',
    excerpt: data.excerpt || articleContent.substring(0, 150).trim() + '...',
  };
}

// Run the script
main().catch(err => {
  console.error('Error running the script:', err);
  process.exit(1);
});