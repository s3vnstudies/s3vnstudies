/**
 * Script to process new article files and add them to the database
 * with proper categorization and images
 */
const fs = require('fs/promises');
const path = require('path');
const { Pool } = require('pg');
const matter = require('gray-matter');

// Create a database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define our new article categories
const CATEGORY_MAPPING = {
  'past-time-stamp.txt': {
    category: 'hobbies-collecting',
    title: 'An Educational Past Time: Stamp Collecting',
    excerpt: 'Discover the educational and rewarding hobby of stamp collecting, also known as philately.',
    image: '/static/images/articles/stamp-collecting.svg'
  },
  'art-collectible-hobby.txt': {
    category: 'hobbies-collecting',
    title: 'Start an Art Collectible Hobby and Beautify Your Home',
    excerpt: 'Learn how to start collecting art pieces that match your taste and budget.',
    image: '/static/images/articles/art-collecting.svg'
  },
  'civil-war-bullet-collecting.txt': {
    category: 'hobbies-collecting',
    title: 'Civil War Bullet Collecting: A Hobby that Honors the Past',
    excerpt: 'Explore the fascinating hobby of collecting Civil War artifacts that connects you to American history.',
    image: '/static/images/articles/civil-war-collecting.svg'
  },
  'collecting-ebay-selling.txt': {
    category: 'hobbies-collecting',
    title: 'If You're Collecting, Ebay Selling is for You!',
    excerpt: 'Discover how eBay can enhance your collecting hobby while also helping you sell duplicates.',
    image: '/static/images/articles/ebay-collecting.svg'
  },
  'arts-and-crafts-idea.txt': {
    category: 'arts-crafts',
    title: 'Arts and Crafts Idea: Foam Sheet Glasses Case',
    excerpt: 'Create a practical and decorative glasses case using simple craft materials.',
    image: '/static/images/articles/foam-crafts.svg'
  },
  'Christmas-craft.txt': {
    category: 'arts-crafts',
    title: 'Christmas Craft: Bead and Pipe Cleaner Ornaments',
    excerpt: 'Make beautiful Christmas ornaments using inexpensive beads and pipe cleaners.',
    image: '/static/images/articles/christmas-crafts.svg'
  },
  'Clay-Pot-Crafts.txt': {
    category: 'arts-crafts',
    title: 'Clay Pot Crafts: Make a Bell for the Porch',
    excerpt: 'Transform simple clay pots into decorative bells for your porch or garden.',
    image: '/static/images/articles/clay-pot-crafts.svg'
  },
  'craft-idea.txt': {
    category: 'arts-crafts',
    title: 'Craft Idea for a Group: Make a Mural',
    excerpt: 'Engage a group in creating a collaborative mural - perfect for classrooms or community events.',
    image: '/static/images/articles/group-mural-crafts.svg'
  },
  'craft-idea-for-kid.txt': {
    category: 'arts-crafts',
    title: 'How to Come up With a Craft Idea for Kid Programs',
    excerpt: 'Tips for teachers and program directors on developing appropriate craft activities for children.',
    image: '/static/images/articles/kids-crafts.svg'
  },
  'creative-handicraft.txt': {
    category: 'arts-crafts',
    title: 'Creative Handicraft: Potholder from Scrap Fabrics',
    excerpt: 'Make useful potholders from scrap fabrics - a practical and sustainable craft project.',
    image: '/static/images/articles/fabric-crafts.svg'
  },
  'beach-holidays.txt': {
    category: 'travel-leisure',
    title: 'Beach Holidays for Fun in the Sun',
    excerpt: 'Plan the perfect beach vacation with these helpful tips for safety and enjoyment.',
    image: '/static/images/articles/beach-vacation.svg'
  },
  'cruise holiday.txt': {
    category: 'travel-leisure',
    title: 'Cruise Holiday Tips for Smooth Sailing',
    excerpt: 'Essential tips for planning and enjoying a cruise vacation without hassles.',
    image: '/static/images/articles/cruise-vacation.svg'
  }
};

// New categories with descriptions for the UI
const NEW_CATEGORIES = {
  'hobbies-collecting': {
    title: 'Hobbies & Collecting',
    description: 'Explore interesting hobbies and collection ideas that can enrich your life and home',
    icon: 'Trophy', // Lucide React icon name
    color: 'bg-amber-50',
    textColor: 'text-amber-600'
  },
  'arts-crafts': {
    title: 'Arts & Crafts',
    description: 'Creative hands-on projects for all ages and skill levels',
    icon: 'Palette', // Lucide React icon name
    color: 'bg-rose-50',
    textColor: 'text-rose-600'
  },
  'travel-leisure': {
    title: 'Travel & Leisure',
    description: 'Tips and guides for making the most of your vacation and leisure time',
    icon: 'Palmtree', // Lucide React icon name
    color: 'bg-cyan-50',
    textColor: 'text-cyan-600'
  }
};

// Function to create SVG images for article thumbnails
async function createSVGImages() {
  // Ensure the directory exists
  try {
    await fs.mkdir(path.join(process.cwd(), 'public/static/images/articles'), { recursive: true });
  } catch (error) {
    console.log('Directory already exists or could not be created');
  }

  // Create SVG files for each article
  for (const [filename, data] of Object.entries(CATEGORY_MAPPING)) {
    const svgName = data.image.split('/').pop();
    const svgPath = path.join(process.cwd(), 'public/static/images/articles', svgName);

    let svgContent = '';
    const iconType = filename.toLowerCase();
    
    // Generate different SVG designs based on category
    if (data.category === 'hobbies-collecting') {
      // Collection-themed SVG
      svgContent = createCollectionSVG(iconType);
    } else if (data.category === 'arts-crafts') {
      // Craft-themed SVG
      svgContent = createCraftsSVG(iconType);
    } else if (data.category === 'travel-leisure') {
      // Travel-themed SVG
      svgContent = createTravelSVG(iconType);
    }

    try {
      await fs.writeFile(svgPath, svgContent);
      console.log(`Created SVG image: ${svgPath}`);
    } catch (error) {
      console.error(`Error creating SVG image for ${filename}:`, error);
    }
  }
}

// Helper function to create collection-themed SVGs
function createCollectionSVG(type) {
  let primaryColor = '#f59e0b'; // Amber
  let secondaryColor = '#fbbf24';
  let icon = '';
  
  if (type.includes('stamp')) {
    icon = '<rect x="20" y="20" width="60" height="45" rx="2" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
           '<rect x="30" y="30" width="40" height="25" rx="1" fill="#f1f5f9" stroke="#64748b" stroke-width="1" stroke-dasharray="2"/>';
  } else if (type.includes('art')) {
    icon = '<rect x="20" y="15" width="60" height="50" rx="1" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
           '<path d="M30 55 L50 25 L70 55 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>';
  } else if (type.includes('civil')) {
    icon = '<path d="M30 30 L50 20 L70 30 L70 60 L50 70 L30 60 Z" fill="#94a3b8" stroke="#475569" stroke-width="2"/>';
  } else if (type.includes('ebay')) {
    icon = '<rect x="25" y="25" width="50" height="35" rx="2" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
           '<path d="M35 40 L45 40 M35 45 L65 45 M35 50 L55 50" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>';
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="45" fill="${primaryColor}" opacity="0.2"/>
    <circle cx="50" cy="50" r="35" fill="${secondaryColor}" opacity="0.3"/>
    ${icon}
  </svg>`;
}

// Helper function to create crafts-themed SVGs
function createCraftsSVG(type) {
  let primaryColor = '#f43f5e'; // Rose
  let secondaryColor = '#fb7185';
  let icon = '';
  
  if (type.includes('foam')) {
    icon = '<rect x="25" y="30" width="50" height="30" rx="15" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
           '<rect x="35" y="40" width="30" height="10" rx="5" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>';
  } else if (type.includes('christmas')) {
    icon = '<path d="M50 20 L60 40 L40 40 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>' +
           '<path d="M50 35 L65 55 L35 55 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>' +
           '<path d="M50 50 L70 70 L30 70 Z" fill="#10b981" stroke="#059669" stroke-width="2"/>' +
           '<rect x="45" y="70" width="10" height="10" fill="#92400e" stroke="#78350f" stroke-width="1"/>';
  } else if (type.includes('clay')) {
    icon = '<path d="M35 30 C35 30 35 60 35 65 C35 70 40 75 50 75 C60 75 65 70 65 65 C65 60 65 30 65 30 L35 30 Z" fill="#f97316" stroke="#ea580c" stroke-width="2"/>' +
           '<path d="M35 30 C35 25 40 20 50 20 C60 20 65 25 65 30 L35 30 Z" fill="#f97316" stroke="#ea580c" stroke-width="2"/>';
  } else if (type.includes('kid')) {
    icon = '<rect x="20" y="30" width="60" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
           '<path d="M30 40 L40 50 L30 60 M70 40 L60 50 L70 60" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
           '<circle cx="50" cy="50" r="10" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>';
  } else if (type.includes('mural')) {
    icon = '<rect x="20" y="25" width="60" height="45" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
           '<path d="M35 35 L45 45 M55 35 L65 45 M35 55 L45 65 M55 55 L65 65" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>';
  } else if (type.includes('fabric')) {
    icon = '<rect x="30" y="30" width="40" height="40" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
           '<path d="M30 30 L70 70 M30 70 L70 30" stroke="#cbd5e1" stroke-width="2"/>';
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="45" fill="${primaryColor}" opacity="0.2"/>
    <circle cx="50" cy="50" r="35" fill="${secondaryColor}" opacity="0.3"/>
    ${icon}
  </svg>`;
}

// Helper function to create travel-themed SVGs
function createTravelSVG(type) {
  let primaryColor = '#06b6d4'; // Cyan
  let secondaryColor = '#22d3ee';
  let icon = '';
  
  if (type.includes('beach')) {
    icon = '<path d="M20 70 L80 70" stroke="#64748b" stroke-width="2"/>' +
           '<path d="M30 70 Q50 40 70 70" fill="none" stroke="#64748b" stroke-width="2"/>' +
           '<circle cx="65" cy="30" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="1"/>';
  } else if (type.includes('cruise')) {
    icon = '<path d="M20 60 L80 60" stroke="#64748b" stroke-width="2"/>' +
           '<path d="M30 60 L30 40 L70 40 L70 60 Z" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
           '<path d="M40 40 L40 30 L60 30 L60 40" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>';
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="45" fill="${primaryColor}" opacity="0.2"/>
    <circle cx="50" cy="50" r="35" fill="${secondaryColor}" opacity="0.3"/>
    ${icon}
  </svg>`;
}

// Function to extract text content from files in the attached_assets directory
async function processArticleFiles() {
  console.log('Processing article files...');
  
  const assetsDir = path.join(process.cwd(), 'attached_assets');
  
  for (const [filename, metadata] of Object.entries(CATEGORY_MAPPING)) {
    try {
      const filePath = path.join(assetsDir, filename);
      
      // Read the file content
      const fileContent = await fs.readFile(filePath, 'utf8');
      
      // Extract title and content
      const title = metadata.title;
      const content = fileContent
        .replace(title, '') // Remove the title from content
        .trim()
        .replace(/\.\.\.\[Truncated\]/g, '...'); // Clean up truncated markers
      
      // Generate markdown with frontmatter
      const markdown = matter.stringify(content, {
        title,
        excerpt: metadata.excerpt,
        author: 'S3vn Studies',
        category: metadata.category,
        thumbnail: metadata.image,
        membershipRequired: 'free', // First article in category is free
      });
      
      // Create output directory if it doesn't exist
      const outputDir = path.join(process.cwd(), 'uploads/articles', metadata.category);
      try {
        await fs.mkdir(outputDir, { recursive: true });
      } catch (error) {
        console.log(`Directory ${outputDir} already exists or could not be created`);
      }
      
      // Write to file
      const outputPath = path.join(outputDir, `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`);
      await fs.writeFile(outputPath, markdown);
      
      console.log(`Processed article: ${title}`);
      
      // Check if article exists in database
      const { rows } = await pool.query(
        'SELECT id FROM articles WHERE title = $1 AND category = $2',
        [title, metadata.category]
      );
      
      if (rows.length > 0) {
        console.log(`Article "${title}" already exists in database, skipping...`);
        continue;
      }
      
      // Insert into database
      await pool.query(
        `INSERT INTO articles (
          title, content, author, excerpt, category, membership_required, thumbnail
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          title, 
          content, 
          'S3vn Studies', 
          metadata.excerpt, 
          metadata.category, 
          'free', // First article in each category is free
          metadata.image
        ]
      );
      
      console.log(`Added article to database: "${title}"`);
      
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }
  }
}

// Update the categories in the UI component
async function updateCategoryUIComponent() {
  try {
    console.log('Updating category UI component...');
    
    const filePath = path.join(process.cwd(), 'client/src/pages/articles-page.tsx');
    
    // Read the file
    let fileContent = await fs.readFile(filePath, 'utf8');
    
    // Find the categoryInfo object in the file
    const categoryInfoRegex = /const categoryInfo: CategoryInfoType = \{[^}]*\};/s;
    const categoryInfoMatch = fileContent.match(categoryInfoRegex);
    
    if (!categoryInfoMatch) {
      console.error('Could not find categoryInfo object in articles-page.tsx');
      return;
    }
    
    // Build new category entries
    let newCategoryEntries = '';
    for (const [key, data] of Object.entries(NEW_CATEGORIES)) {
      newCategoryEntries += `
    "${key}": {
      title: "${data.title}",
      description: "${data.description}",
      icon: <${data.icon} className="h-10 w-10 mb-4 ${data.textColor}" />,
      color: "${data.color}",
    },`;
    }
    
    // Insert new categories into the existing object
    const updatedCategoryInfo = categoryInfoMatch[0].replace(/\};$/, `${newCategoryEntries}\n  };`);
    
    // Replace in the file content
    fileContent = fileContent.replace(categoryInfoRegex, updatedCategoryInfo);
    
    // Write the updated file
    await fs.writeFile(filePath, fileContent);
    
    console.log('Updated category UI component successfully');
    
  } catch (error) {
    console.error('Error updating category UI component:', error);
  }
}

// Main function to run all the processing steps
async function main() {
  try {
    console.log('Starting article processing...');
    
    // First create SVG images for thumbnails
    await createSVGImages();
    
    // Process article files and update database
    await processArticleFiles();
    
    // Update UI component
    await updateCategoryUIComponent();
    
    console.log('Article processing completed successfully!');
    
  } catch (error) {
    console.error('Error in article processing:', error);
  } finally {
    // Close database connection
    pool.end();
  }
}

// Run the script
main();