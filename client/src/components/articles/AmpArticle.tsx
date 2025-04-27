import React from "react";
import { type Article } from "@shared/schema";
import { getAmpAttributes, getAmpTagName, generateAmpSchema } from "@/lib/amp-utils";
import { formatDate } from "@/lib/utils";

interface AmpArticleProps {
  article: Article;
}

/**
 * AMP-compatible Article Component
 * 
 * This component renders articles in a way that's compatible with
 * Google's Accelerated Mobile Pages (AMP) specification.
 */
export const AmpArticle: React.FC<AmpArticleProps> = ({ article }) => {
  // Generate structured data for the article
  const articleSchema = generateAmpSchema("Article", {
    headline: article.title,
    description: article.excerpt || "",
    image: article.thumbnail || "",
    datePublished: article.publishDate.toISOString(),
    dateModified: article.publishDate.toISOString(),
    author: {
      "@type": "Person",
      name: article.author || "S3vn Studies",
    },
    publisher: {
      "@type": "Organization",
      name: "S3vn Studies",
      logo: {
        "@type": "ImageObject",
        url: "https://s3vnstudies.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://s3vnstudies.com/articles/${article.id}`,
    },
  });

  // Process content to make it AMP-compatible
  const processContent = (content: string): string => {
    let processedContent = content;

    // Replace img tags with amp-img
    processedContent = processedContent.replace(
      /<img([^>]*)>/g,
      (match, attributes) => {
        // Extract src, width, height from attributes
        const srcMatch = attributes.match(/src="([^"]*)"/);
        const widthMatch = attributes.match(/width="([^"]*)"/);
        const heightMatch = attributes.match(/height="([^"]*)"/);

        const src = srcMatch ? srcMatch[1] : "";
        const width = widthMatch ? widthMatch[1] : "640";
        const height = heightMatch ? heightMatch[1] : "360";

        return `<amp-img layout="responsive" src="${src}" width="${width}" height="${height}" alt="Article image"></amp-img>`;
      }
    );

    // Replace iframe tags with amp-iframe
    processedContent = processedContent.replace(
      /<iframe([^>]*)>/g,
      (match, attributes) => {
        // Extract src from attributes
        const srcMatch = attributes.match(/src="([^"]*)"/);
        const src = srcMatch ? srcMatch[1] : "";

        return `<amp-iframe layout="responsive" sandbox="allow-scripts allow-same-origin" src="${src}" width="640" height="360" frameborder="0" allowfullscreen></amp-iframe>`;
      }
    );

    // Replace video tags with amp-video
    processedContent = processedContent.replace(
      /<video([^>]*)>(.*?)<\/video>/g,
      (match, attributes, content) => {
        // Extract src if available
        const srcMatch = attributes.match(/src="([^"]*)"/);
        const src = srcMatch ? `src="${srcMatch[1]}"` : "";

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
  };

  return (
    <div className="amp-article">
      {/* Structured data script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleSchema }}
      />

      <h1 className="text-3xl font-bold mb-3">{article.title}</h1>

      {article.thumbnail && (
        <div className="mb-6">
          <amp-img
            src={article.thumbnail}
            alt={article.title}
            width="1200"
            height="630"
            layout="responsive"
          />
        </div>
      )}

      <div className="flex items-center text-sm text-gray-600 mb-6">
        <span className="mr-4">
          By {article.author || "S3vn Studies"}
        </span>
        <span>
          {formatDate(article.publishDate)}
        </span>
      </div>

      {/* Article tags/categories */}
      {article.category && (
        <div className="mb-6">
          <a
            href={`/articles/category/${article.category}`}
            className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
          >
            {article.category}
          </a>
        </div>
      )}

      {/* Article content - AMP-compatible */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: processContent(article.content),
        }}
      />

      {/* AMP-compliant ads */}
      <div className="my-6">
        <amp-ad
          width="100vw"
          height="320"
          type="adsense"
          data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
          data-ad-slot="XXXXXXXXXX"
          data-auto-format="rspv"
          data-full-width=""
        >
          <div overflow=""></div>
        </amp-ad>
      </div>
    </div>
  );
};

export default AmpArticle;