// Script to extract content from DOC files and convert to markdown
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const execPromise = promisify(exec);

// Helper function to create directories if they don't exist
async function ensureDir(dir) {
  try {
    await stat(dir);
  } catch (e) {
    await mkdir(dir, { recursive: true });
  }
}

// Convert DOC to text using antiword
async function docToText(docPath) {
  try {
    // First we'll check if the file is a doc file
    const { stdout } = await execPromise(`file "${docPath}"`);
    
    if (stdout.toLowerCase().includes('composite document file')) {
      // It's a DOC file, use antiword to extract text
      console.log(`Converting DOC file: ${docPath}`);
      const { stdout: content } = await execPromise(`antiword "${docPath}"`);
      return content;
    } else if (stdout.toLowerCase().includes('microsoft word')) {
      // It's a DOCX file, but we don't have docx2txt
      console.log(`Warning: DOCX file found but can't process it: ${docPath}`);
      console.log(`Skipping file: ${docPath}`);
      return null;
    } else {
      throw new Error(`Not a recognized Word document: ${docPath}`);
    }
  } catch (error) {
    console.error(`Error converting file ${docPath}:`, error.message);
    return null;
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

// Process a directory of DOC files
async function processDirectory(sourcePath, category, outputPath) {
  try {
    const files = await readdir(sourcePath);
    let processedCount = 0;
    
    for (const file of files) {
      if (!file.endsWith('.doc') && !file.endsWith('.docx')) continue;
      
      try {
        const filePath = path.join(sourcePath, file);
        const fileInfo = await stat(filePath);
        
        // Skip if it's not a file or is empty
        if (!fileInfo.isFile() || fileInfo.size === 0) continue;
        
        // Extract text from DOC/DOCX
        const content = await docToText(filePath);
        
        if (!content) {
          console.error(`Failed to extract content from ${file}`);
          continue;
        }
        
        // Extract title from filename or first line
        let title = path.basename(file, path.extname(file)).replace(/_/g, ' ');
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

// Main function to process health articles
async function main() {
  const category = {
    name: 'health',
    sourcePath: 'temp/health/MedicinesandHealthcarePLRArticlesPack/Articles',
    outputPath: 'uploads/articles/health'
  };
  
  console.log('Starting health article conversion...');
  
  try {
    // antiword is already installed as a system dependency
    console.log(`Processing ${category.name} articles...`);
    const count = await processDirectory(
      category.sourcePath, 
      category.name, 
      category.outputPath
    );
    
    console.log(`Conversion complete. Total files processed: ${count}`);
  } catch (err) {
    console.error(`Error processing category ${category.name}:`, err);
  }
}

// Run the script
main().catch(err => {
  console.error('Error running conversion script:', err);
});