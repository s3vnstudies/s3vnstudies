import { Request, Response } from "express";
import { storage } from "./storage";

/**
 * Server-side AMP support
 * 
 * This module provides the necessary server-side functionality
 * for supporting Accelerated Mobile Pages (AMP).
 */

/**
 * Render AMP version of an article
 */
export async function renderAmpArticle(req: Request, res: Response) {
  try {
    const articleId = parseInt(req.params.id);
    const article = await storage.getArticleById(articleId);
    
    if (!article) {
      return res.status(404).send("Article not found");
    }
    
    // Basic AMP HTML template
    const ampHtml = `
      <!doctype html>
      <html amp lang="en">
        <head>
          <meta charset="utf-8">
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
          <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
          <script async custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"></script>
          <script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"></script>
          <script async custom-element="amp-consent" src="https://cdn.ampproject.org/v0/amp-consent-0.1.js"></script>
          <title>${article.title} - S3vn Studies</title>
          <link rel="canonical" href="https://s3vnstudies.com/articles/${article.id}">
          <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
          <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
          
          <style amp-custom>
            /* Basic styling for AMP pages */
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              color: #333;
              line-height: 1.6;
              padding: 0;
              margin: 0;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            header {
              text-align: center;
              padding: 16px 0;
              background-color: #007bff;
              color: white;
              margin-bottom: 24px;
            }
            h1 {
              font-size: 28px;
              margin-bottom: 12px;
            }
            .article-meta {
              font-size: 14px;
              color: #666;
              margin-bottom: 24px;
            }
            .article-content {
              margin-bottom: 24px;
            }
            .article-content p {
              margin-bottom: 16px;
            }
            .article-category {
              display: inline-block;
              background-color: #e9f4ff;
              color: #007bff;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 14px;
              margin-bottom: 16px;
            }
            .article-footer {
              border-top: 1px solid #eee;
              padding-top: 24px;
              margin-top: 24px;
            }
            .related-articles {
              margin-top: 32px;
            }
            .related-article {
              margin-bottom: 16px;
              padding-bottom: 16px;
              border-bottom: 1px solid #eee;
            }
            .related-article h3 {
              font-size: 18px;
              margin-bottom: 8px;
            }
            .related-article p {
              font-size: 14px;
              color: #666;
            }
            footer {
              text-align: center;
              padding: 24px 0;
              background-color: #f1f1f1;
              color: #666;
              font-size: 14px;
            }
          </style>
          
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "${article.title}",
              "image": "${article.thumbnail || ''}",
              "datePublished": "${article.publishDate.toISOString()}",
              "dateModified": "${article.publishDate.toISOString()}",
              "author": {
                "@type": "Person",
                "name": "${article.author || 'S3vn Studies'}"
              },
              "publisher": {
                "@type": "Organization",
                "name": "S3vn Studies",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://s3vnstudies.com/logo.png"
                }
              },
              "description": "${article.excerpt || ''}",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://s3vnstudies.com/articles/${article.id}"
              }
            }
          </script>
        </head>
        <body>
          <!-- AMP Consent -->
          <amp-consent id="consent" layout="nodisplay">
            <script type="application/json">
              {
                "consentInstanceId": "s3vn-consent",
                "consentRequired": "remote",
                "checkConsentHref": "/api/amp/consent",
                "promptUI": "consent-ui"
              }
            </script>
            <div id="consent-ui">
              <div class="container">
                <h2>Cookies and Advertising Consent</h2>
                <p>We use cookies and similar technologies to improve your browsing experience, personalize content and ads, and analyze our traffic.</p>
                <div class="buttons">
                  <button on="tap:consent.reject">Decline</button>
                  <button on="tap:consent.accept">Accept</button>
                </div>
              </div>
            </div>
          </amp-consent>
          
          <!-- AMP Analytics -->
          <amp-analytics type="googleanalytics" data-credentials="include">
            <script type="application/json">
              {
                "vars": {
                  "account": "UA-XXXXXXX-X"
                },
                "triggers": {
                  "trackPageview": {
                    "on": "visible",
                    "request": "pageview"
                  }
                }
              }
            </script>
          </amp-analytics>
          
          <header>
            <div class="container">
              <div>S3vn Studies</div>
            </div>
          </header>
          
          <div class="container">
            <h1>${article.title}</h1>
            
            <div class="article-meta">
              <span>By ${article.author || 'S3vn Studies'}</span>
              <span> • </span>
              <span>${new Date(article.publishDate).toLocaleDateString()}</span>
            </div>
            
            ${article.category ? `<div class="article-category">${article.category}</div>` : ''}
            
            ${article.thumbnail ? 
              `<amp-img src="${article.thumbnail}" alt="${article.title}" width="1200" height="630" layout="responsive"></amp-img>` 
              : ''
            }
            
            <div class="article-content">
              ${processAmpContent(article.content)}
            </div>
            
            <!-- AMP Ad -->
            <amp-ad width="100vw"
              height="320"
              type="adsense"
              data-ad-client="${process.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX'}"
              data-ad-slot="XXXXXXXXXX"
              data-auto-format="rspv"
              data-full-width=""
              required-consent>
              <div overflow=""></div>
            </amp-ad>
            
            <div class="article-footer">
              <p>Thanks for reading! Follow us for more content.</p>
            </div>
          </div>
          
          <footer>
            <div class="container">
              <p>&copy; ${new Date().getFullYear()} S3vn Studies. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
    `;
    
    // Send AMP HTML with appropriate headers
    res.set({
      'Content-Type': 'text/html',
      'AMP-Access-Control-Allow-Source-Origin': 'https://s3vnstudies.com',
      'Access-Control-Allow-Origin': '*'
    });
    
    return res.send(ampHtml);
  } catch (error) {
    console.error('Error rendering AMP article:', error);
    return res.status(500).send('Error rendering AMP page');
  }
}

/**
 * Process article content to make it AMP-compatible
 */
function processAmpContent(content: string): string {
  if (!content) return '';
  
  let processedContent = content;
  
  // Replace img tags with amp-img
  processedContent = processedContent.replace(
    /<img([^>]*)>/g,
    (match, attributes) => {
      // Extract src, width, height from attributes
      const srcMatch = attributes.match(/src="([^"]*)"/);
      const widthMatch = attributes.match(/width="([^"]*)"/);
      const heightMatch = attributes.match(/height="([^"]*)"/);
      
      const src = srcMatch ? srcMatch[1] : '';
      const width = widthMatch ? widthMatch[1] : '640';
      const height = heightMatch ? heightMatch[1] : '360';
      
      return `<amp-img layout="responsive" src="${src}" width="${width}" height="${height}" alt="Article image"></amp-img>`;
    }
  );
  
  // Replace iframe tags with amp-iframe
  processedContent = processedContent.replace(
    /<iframe([^>]*)>/g,
    (match, attributes) => {
      // Extract src from attributes
      const srcMatch = attributes.match(/src="([^"]*)"/);
      const src = srcMatch ? srcMatch[1] : '';
      
      return `<amp-iframe layout="responsive" sandbox="allow-scripts allow-same-origin" src="${src}" width="640" height="360" frameborder="0" allowfullscreen></amp-iframe>`;
    }
  );
  
  // Replace video tags with amp-video
  processedContent = processedContent.replace(
    /<video([^>]*)>(.*?)<\/video>/g,
    (match, attributes, content) => {
      // Extract src if available
      const srcMatch = attributes.match(/src="([^"]*)"/);
      const src = srcMatch ? `src="${srcMatch[1]}"` : '';
      
      return `<amp-video layout="responsive" ${src} width="640" height="360" controls>${content}</amp-video>`;
    }
  );
  
  // YouTube embeds
  processedContent = processedContent.replace(
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g,
    (match, videoId) => {
      return `<amp-youtube data-videoid="${videoId}" layout="responsive" width="480" height="270"></amp-youtube>`;
    }
  );
  
  return processedContent;
}

/**
 * AMP Consent endpoint
 * Returns consent state to AMP pages
 */
export async function handleAmpConsent(req: Request, res: Response) {
  // Note: In a real implementation, you should check for existing consent
  // based on cookies, local storage, or your consent management platform
  
  // For testing, we're returning a simple consent object
  // In production, replace with real consent logic
  const consentResponse = {
    consentRequired: true,
    consentStateValue: null, // null means "decision not made yet"
    consentString: "", // Optional, for TCF v2 compliance
    consentMetadata: {
      consentStringType: 1, // 1 for TCF v2
    },
    promptIfUnknown: true,
  };
  
  // Set CORS headers for AMP
  res.set({
    'Content-Type': 'application/json',
    'AMP-Access-Control-Allow-Source-Origin': req.headers.origin || 'https://s3vnstudies.com',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Expose-Headers': 'AMP-Access-Control-Allow-Source-Origin'
  });
  
  return res.json(consentResponse);
}

/**
 * Handles AMP CORS requests
 */
export function handleAmpCorsRequest(req: Request, res: Response) {
  // Handle AMP CORS pre-flight requests
  res.set({
    'AMP-Access-Control-Allow-Source-Origin': req.headers.origin || 'https://s3vnstudies.com',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Expose-Headers': 'AMP-Access-Control-Allow-Source-Origin'
  });
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  // For non-OPTIONS requests, proceed to the next middleware
  res.status(200).json({ success: true });
}