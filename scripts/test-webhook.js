/**
 * This script sends a test webhook request to the local server to verify webhook handling.
 * Usage: node scripts/test-webhook.js
 */

const crypto = require('crypto');
const fetch = require('node-fetch');

// Configuration (change these values as needed)
const WEBHOOK_URL = 'http://localhost:5000/api/webhook/github';
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'your_webhook_secret';

// Create a sample payload (simulating a GitHub push event)
const payload = {
  ref: 'refs/heads/main',
  repository: {
    full_name: 's3vnstudies/s3vnstudies',
    name: 's3vnstudies',
    owner: {
      name: 's3vnstudies',
      login: 's3vnstudies'
    }
  },
  pusher: {
    name: 'test-script',
    email: 'test@example.com'
  },
  commits: [
    {
      id: 'test-commit-id',
      message: 'Test commit from webhook test script',
      timestamp: new Date().toISOString(),
      author: {
        name: 'Test Script',
        email: 'test@example.com'
      }
    }
  ]
};

// Create the signature
const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
const signature = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex');

// Send the webhook request
async function sendWebhook() {
  try {
    console.log('Sending test webhook to:', WEBHOOK_URL);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GitHub-Event': 'push',
        'X-GitHub-Delivery': crypto.randomUUID(),
        'X-Hub-Signature-256': signature
      },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);
    
    if (response.ok) {
      console.log('Webhook test successful!');
    } else {
      console.error('Webhook test failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

sendWebhook();