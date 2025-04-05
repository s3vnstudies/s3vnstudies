// Script to convert text articles to markdown format with proper frontmatter
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);

// Helper function to create directories if they don't exist
async function ensureDir(dir) {
  try {
    await stat(dir);
  } catch (e) {
    await mkdir(dir, { recursive: true });
  }
}

// Convert text to markdown with frontmatter
function convertToMarkdown(title, content, category) {
  // Extract first paragraph for excerpt (up to 150 chars)
  const paragraphs = content.split('\n\n');
  let excerpt = '';
  
  if (paragraphs.length > 1) {
    excerpt = paragraphs[1].substring(0, 150).trim();
    if (excerpt.length === 150) excerpt += '...';
  } else if (paragraphs.length === 1) {
    excerpt = paragraphs[0].substring(0, 150).trim();
    if (excerpt.length === 150) excerpt += '...';
  }

  // Create frontmatter
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
author: "S3vn Studies Team"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
category: "${category}"
membershipRequired: "pro"
---

`;

  // Format the content as markdown
  return frontmatter + content;
}

// Process a directory of text files
async function processDirectory(sourcePath, category, outputPath) {
  try {
    const files = await readdir(sourcePath);
    let processedCount = 0;
    
    for (const file of files) {
      if (!file.endsWith('.txt')) continue;
      
      try {
        const filePath = path.join(sourcePath, file);
        const content = await readFile(filePath, 'utf8');
        const fileInfo = await stat(filePath);
        
        // Skip if it's not a file or is empty
        if (!fileInfo.isFile() || fileInfo.size === 0) continue;
        
        // Extract title from filename or first line
        let title = path.basename(file, '.txt').replace(/_/g, ' ');
        const lines = content.split('\n');
        
        // If first line seems like a title, use it instead
        if (lines[0].trim().length > 0 && lines[0].trim().length < 100) {
          title = lines[0].trim();
          // Remove the title from content if it's used
          lines.shift();
        }
        
        // Clean up and format the content
        const cleanedContent = lines.join('\n')
          .replace(/\r\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        
        // Convert to markdown with frontmatter
        const markdown = convertToMarkdown(title, cleanedContent, category);
        
        // Create filename for markdown file
        const outputFileName = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') + '.md';
        
        // Make sure the output directory exists
        await ensureDir(outputPath);
        
        // Write the markdown file
        const outputFilePath = path.join(outputPath, outputFileName);
        await writeFile(outputFilePath, markdown);
        
        processedCount++;
        console.log(`Processed: ${outputFileName}`);
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    }
    
    console.log(`Category ${category}: ${processedCount} files processed`);
    return processedCount;
  } catch (err) {
    console.error(`Error processing directory ${sourcePath}:`, err);
    return 0;
  }
}

// Main function to process all categories
async function main() {
  const categories = [
    {
      name: 'meditation',
      sourcePath: 'temp/meditation_articles/Meditation Articles',
      outputPath: 'uploads/articles/meditation'
    },
    {
      name: 'self-confidence',
      sourcePath: 'temp/self-confidence/SelfConfidencePLRArticlesPack/Articles',
      outputPath: 'uploads/articles/self-confidence'
    },
    {
      name: 'self-help',
      sourcePath: 'temp/self-help/SelfHelpPLRArticlesPack/Articles',
      outputPath: 'uploads/articles/self-help'
    },
    {
      name: 'time-management',
      sourcePath: 'temp/time-management/TimeManagementPLRArticlesPackV2/Articles',
      outputPath: 'uploads/articles/time-management'
    },
    {
      name: 'self-defeating',
      sourcePath: 'temp/self-defeating/SelfDefeatingPLRArticlesPack/Articles',
      outputPath: 'uploads/articles/self-defeating'
    },
    {
      name: 'vitamins',
      sourcePath: 'temp/vitamins/VitaminsandSupplementsPLRArticlesPack/Articles',
      outputPath: 'uploads/articles/vitamins'
    },
    {
      name: 'finances',
      sourcePath: 'temp/finances/Unrestricted-PLR-Articles-Personal-Finance',
      outputPath: 'uploads/articles/finances'
    },
    {
      name: 'miscellaneous',
      sourcePath: 'temp/miscellaneous/MiscellaneousPLRArticlesPack/Articles',
      outputPath: 'uploads/articles/miscellaneous'
    },
    {
      name: 'motorhomes',
      sourcePath: 'temp/motorhomes/MotorHomesPLRArticlesPack/Articles',
      outputPath: 'uploads/articles/motorhomes'
    }
  ];
  
  console.log('Starting article conversion...');
  
  let totalProcessed = 0;
  for (const category of categories) {
    try {
      console.log(`Processing ${category.name} articles...`);
      const count = await processDirectory(
        category.sourcePath, 
        category.name, 
        category.outputPath
      );
      totalProcessed += count;
    } catch (err) {
      console.error(`Error processing category ${category.name}:`, err);
    }
  }
  
  console.log(`Conversion complete. Total files processed: ${totalProcessed}`);
}

// Run the script
main().catch(err => {
  console.error('Error running conversion script:', err);
});