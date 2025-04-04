// Script to update article content with correct images and membership settings
const fs = require('fs');
const path = require('path');

// Import storage to directly access and update articles
const { storage } = require('../server/storage');

async function updateArticles() {
  try {
    console.log("Starting article updates...");
    
    // Update self-improvement articles
    // First article is free, the rest require pro membership
    let article = await storage.getArticleById(1);
    if (article) {
      const updatedArticle = await storage.updateArticle(1, {
        title: "Mastering the Growth Mindset",
        membershipRequired: "free",
        thumbnail: "/images/articles/self-improvement/growth-mindset.png",
        images: [
          "/images/articles/self-improvement/growth-mindset.png",
          "/images/articles/self-improvement/positive-habits.png",
          "/images/articles/self-improvement/mindfulness.png"
        ]
      });
      console.log("Updated article 1:", updatedArticle.title);
    }

    // Update article 2
    article = await storage.getArticleById(2);
    if (article) {
      const updatedArticle = await storage.updateArticle(2, {
        title: "Effective Goal Setting",
        membershipRequired: "pro",
        thumbnail: "/images/articles/self-improvement/goal-setting.png",
        images: [
          "/images/articles/self-improvement/goal-setting.png",
          "/images/articles/self-improvement/growth-mindset.png"
        ]
      });
      console.log("Updated article 2:", updatedArticle.title);
    }

    // Update article 3
    article = await storage.getArticleById(3);
    if (article) {
      const updatedArticle = await storage.updateArticle(3, {
        title: "Developing Emotional Intelligence",
        membershipRequired: "pro",
        thumbnail: "/images/articles/self-improvement/emotional-intelligence.png",
        images: [
          "/images/articles/self-improvement/emotional-intelligence.png",
          "/images/articles/self-improvement/mindfulness.png"
        ]
      });
      console.log("Updated article 3:", updatedArticle.title);
    }

    // Update article 4
    article = await storage.getArticleById(4);
    if (article) {
      const updatedArticle = await storage.updateArticle(4, {
        title: "Building Positive Habits",
        membershipRequired: "pro",
        thumbnail: "/images/articles/self-improvement/positive-habits.png",
        images: [
          "/images/articles/self-improvement/positive-habits.png",
          "/images/articles/self-improvement/goal-setting.png"
        ]
      });
      console.log("Updated article 4:", updatedArticle.title);
    }

    // Update article 5
    article = await storage.getArticleById(5);
    if (article) {
      const updatedArticle = await storage.updateArticle(5, {
        title: "Mindfulness for Daily Living",
        membershipRequired: "pro",
        thumbnail: "/images/articles/self-improvement/mindfulness.png",
        images: [
          "/images/articles/self-improvement/mindfulness.png",
          "/images/articles/self-improvement/emotional-intelligence.png"
        ]
      });
      console.log("Updated article 5:", updatedArticle.title);
    }

    // Update anger management articles
    // First article is free, the rest require pro membership
    article = await storage.getArticleById(8);
    if (article) {
      const updatedArticle = await storage.updateArticle(8, {
        title: "Understanding Anger: The First Step to Management",
        membershipRequired: "free",
        thumbnail: "/images/articles/anger-management/understanding-anger.jpg",
        images: [
          "/images/articles/anger-management/understanding-anger.jpg",
          "/images/articles/anger-management/anger-control.jpg"
        ]
      });
      console.log("Updated article 8:", updatedArticle.title);
    }

    // Update article 9
    article = await storage.getArticleById(9);
    if (article) {
      const updatedArticle = await storage.updateArticle(9, {
        title: "Techniques for Anger Control",
        membershipRequired: "pro",
        thumbnail: "/images/articles/anger-management/anger-control.jpg",
        images: [
          "/images/articles/anger-management/anger-control.jpg",
          "/images/articles/anger-management/cognitive-strategies.jpg"
        ]
      });
      console.log("Updated article 9:", updatedArticle.title);
    }

    // Update article 10
    article = await storage.getArticleById(10);
    if (article) {
      const updatedArticle = await storage.updateArticle(10, {
        title: "Cognitive Strategies for Managing Anger",
        membershipRequired: "pro",
        thumbnail: "/images/articles/anger-management/cognitive-strategies.jpg",
        images: [
          "/images/articles/anger-management/cognitive-strategies.jpg",
          "/images/articles/anger-management/understanding-anger.jpg"
        ]
      });
      console.log("Updated article 10:", updatedArticle.title);
    }

    console.log("Article updates completed successfully!");
  } catch (error) {
    console.error("Error updating articles:", error);
  }
}

// Run the update function
updateArticles();