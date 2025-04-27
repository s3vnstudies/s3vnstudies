import { Request, Response } from 'express';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';

const execAsync = promisify(exec);
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface DeploymentStatus {
  lastDeployment: {
    time: string;
    status: 'success' | 'failed';
    error?: string;
  };
  history: Array<{
    time: string;
    status: 'success' | 'failed';
    error?: string;
    type: 'manual' | 'webhook';
  }>;
}

// In-memory deployment status
const deploymentStatus: DeploymentStatus = {
  lastDeployment: {
    time: '',
    status: 'success',
  },
  history: [],
};

/**
 * Verify GitHub webhook signature
 */
function verifySignature(req: Request): boolean {
  if (!GITHUB_WEBHOOK_SECRET) {
    console.warn('GITHUB_WEBHOOK_SECRET is not set. Webhook signature verification skipped.');
    return true; // Skip verification if secret is not set
  }

  const signature = req.headers['x-hub-signature-256'] as string;
  if (!signature) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}

/**
 * Pull changes from GitHub and update the application
 */
export async function pullChanges(): Promise<{ success: boolean; message: string }> {
  try {
    // Record start time
    const startTime = new Date().toISOString();
    let deploymentType = 'manual';
    
    // Check if git is available
    try {
      await execAsync('git --version');
    } catch (err) {
      console.error('Git is not available:', err);
      
      // If git is not available, try to use the GitHub API to get the latest files
      if (!GITHUB_TOKEN) {
        throw new Error('GitHub token is not available and git is not installed. Cannot fetch updates.');
      }
      
      // Fetch the latest files from GitHub
      await fetchLatestFiles();
      
      // Update the deployment status
      deploymentStatus.lastDeployment = {
        time: startTime,
        status: 'success',
      };
      
      deploymentStatus.history.unshift({
        time: startTime,
        status: 'success',
        type: deploymentType as 'manual' | 'webhook',
      });
      
      return { success: true, message: 'Successfully fetched the latest files from GitHub API.' };
    }
    
    // Set git config if not already set
    try {
      await execAsync('git config --get user.name');
    } catch (err) {
      await execAsync('git config --global user.name "S3vn Studies Bot"');
      await execAsync('git config --global user.email "bot@s3vnstudies.com"');
    }
    
    // Pull the latest changes
    const { stdout, stderr } = await execAsync('git pull origin main');
    
    // Update the deployment status
    deploymentStatus.lastDeployment = {
      time: startTime,
      status: 'success',
    };
    
    deploymentStatus.history.unshift({
      time: startTime,
      status: 'success',
      type: deploymentType as 'manual' | 'webhook',
    });
    
    // Limit history to the last 10 deployments
    if (deploymentStatus.history.length > 10) {
      deploymentStatus.history = deploymentStatus.history.slice(0, 10);
    }
    
    return { success: true, message: stdout || 'Successfully pulled the latest changes.' };
  } catch (error: any) {
    const errorTime = new Date().toISOString();
    
    // Update the deployment status
    deploymentStatus.lastDeployment = {
      time: errorTime,
      status: 'failed',
      error: error.message,
    };
    
    deploymentStatus.history.unshift({
      time: errorTime,
      status: 'failed',
      error: error.message,
      type: 'manual',
    });
    
    // Limit history to the last 10 deployments
    if (deploymentStatus.history.length > 10) {
      deploymentStatus.history = deploymentStatus.history.slice(0, 10);
    }
    
    console.error('Error pulling changes:', error);
    return { success: false, message: error.message || 'An error occurred while pulling changes.' };
  }
}

/**
 * Fetch the latest files from GitHub API (fallback method)
 */
async function fetchLatestFiles(): Promise<void> {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token is not available.');
  }
  
  // TODO: Implement fetching and extracting the latest files from GitHub API
  // This would involve:
  // 1. Fetching the repo as a tarball/zipball
  // 2. Extracting it to a temporary location
  // 3. Copying the files to the appropriate location
  // 4. Cleaning up temporary files
  
  throw new Error('Direct API file fetching not implemented. Please install git.');
}

/**
 * Webhook handler for GitHub push events
 */
export function handleWebhook(req: Request, res: Response) {
  // Verify the signature
  if (!verifySignature(req)) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Only process push events to the main branch
  const event = req.headers['x-github-event'] as string;
  if (event !== 'push') {
    return res.status(200).json({ message: 'Event ignored' });
  }
  
  const payload = req.body;
  if (payload.ref !== 'refs/heads/main') {
    return res.status(200).json({ message: 'Branch ignored' });
  }
  
  // Process the webhook asynchronously
  pullChanges()
    .then(result => {
      console.log('Deployment result:', result);
    })
    .catch(error => {
      console.error('Deployment error:', error);
    });
  
  // Return immediately so GitHub doesn't timeout
  return res.status(202).json({ message: 'Deployment started' });
}

/**
 * API endpoint to trigger a manual deployment
 */
export function handleManualDeploy(req: Request, res: Response) {
  // Check if user is authenticated and is an admin
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Start the deployment
  pullChanges()
    .then(result => {
      if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(500).json({ error: result.message });
      }
    })
    .catch(error => {
      console.error('Manual deployment error:', error);
      res.status(500).json({ error: error.message || 'An error occurred during deployment' });
    });
}

/**
 * API endpoint to get deployment status
 */
export function getDeploymentStatus(req: Request, res: Response) {
  // Check if user is authenticated and is an admin
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.status(200).json(deploymentStatus);
}