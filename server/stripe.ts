import Stripe from "stripe";
import type { Request, Response } from "express";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define the price ID for Pro membership
// This would come from your Stripe dashboard
const SUBSCRIPTION_PRICE_ID = 'price_1PGUaQJqDxL7GBYXNDXRnYls'; // Replace with your actual price ID

/**
 * Create or retrieve a subscription for a user
 */
export async function getOrCreateSubscription(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ error: 'Authentication required' });
    }

    const user = req.user;

    // Check if the user already has a subscription
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        // If active subscription exists, return the payment intent client secret
        if (subscription.status === 'active') {
          return res.send({
            status: 'active',
            subscriptionId: subscription.id
          });
        }
        
        // If there's a subscription but it's not active (e.g., incomplete), return the client secret
        if (subscription.status === 'incomplete' && subscription.latest_invoice) {
          const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string, {
            expand: ['payment_intent']
          });
          
          if (invoice.payment_intent && typeof invoice.payment_intent !== 'string') {
            return res.send({
              status: 'incomplete',
              subscriptionId: subscription.id,
              clientSecret: invoice.payment_intent.client_secret
            });
          }
        }
      } catch (error) {
        // If we can't retrieve the subscription (e.g., it was deleted in Stripe dashboard)
        // continue and create a new one
        console.error('Error retrieving subscription:', error);
      }
    }

    // Create a new customer if the user doesn't have one
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      if (!user.email) {
        return res.status(400).send({ error: 'User email required to create subscription' });
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName || user.username,
        metadata: {
          userId: user.id.toString(),
        }
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await storage.updateStripeCustomerId(user.id, customerId);
    }

    // Create a new subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: SUBSCRIPTION_PRICE_ID,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Get the client secret
    const clientSecret = (subscription.latest_invoice as Stripe.Invoice)
      ?.payment_intent
      ?.client_secret;

    if (!clientSecret) {
      return res.status(500).send({ error: 'Failed to generate payment information' });
    }

    // Store the subscription ID with the user
    await storage.updateStripeSubscriptionId(user.id, subscription.id);
    
    // Return the client secret for the frontend to complete payment
    return res.send({
      status: 'incomplete',
      subscriptionId: subscription.id,
      clientSecret,
    });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return res.status(500).send({ 
      error: error.message || 'Failed to process subscription request'
    });
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send(`Webhook secret not configured`);
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

/**
 * Handle successful payment for an invoice
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // When an invoice is paid, update the user's membership
  if (invoice.subscription && invoice.customer) {
    const customerId = typeof invoice.customer === 'string' 
      ? invoice.customer
      : invoice.customer.id;
      
    const user = await storage.getUserByStripeCustomerId(customerId);
    
    if (user) {
      // Update user's membership tier to 'pro'
      await storage.updateUserMembership(user.id, 'pro');
      console.log(`User ${user.id} upgraded to Pro membership`);
    }
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  if (typeof subscription.customer === 'string') {
    const user = await storage.getUserByStripeCustomerId(subscription.customer);
    
    if (user) {
      // If subscription is active, ensure the user has pro membership
      if (subscription.status === 'active' && user.membershipTier !== 'pro') {
        await storage.updateUserMembership(user.id, 'pro');
        console.log(`User ${user.id} membership updated to Pro`);
      }
      // If subscription is canceled, downgrade to free tier
      else if (['canceled', 'unpaid'].includes(subscription.status) && user.membershipTier === 'pro') {
        await storage.updateUserMembership(user.id, 'free');
        console.log(`User ${user.id} downgraded to Free membership`);
      }
    }
  }
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  if (typeof subscription.customer === 'string') {
    const user = await storage.getUserByStripeCustomerId(subscription.customer);
    
    if (user && user.membershipTier === 'pro') {
      await storage.updateUserMembership(user.id, 'free');
      console.log(`User ${user.id} downgraded to Free membership - subscription deleted`);
    }
  }
}