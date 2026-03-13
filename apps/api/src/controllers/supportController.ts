import type { Request, Response } from 'express';
import type { SupportChatRequest, SupportChatResponse } from '@bundle-up/shared-types';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildReply(message: string, variant: 'sfi' | 'nfi'): string {
  const m = normalize(message);

  if (!m) {
    return 'Tell me what you need help with, and I’ll point you to the right place.';
  }

  if (/(hello|hi|hey|good morning|good afternoon|good evening)/.test(m)) {
    return variant === 'nfi'
      ? 'Hi! How can I help with your business ordering today?'
      : 'Hi! How can I help with your order today?';
  }

  if (/(order|orders|invoice|history|receipt)/.test(m)) {
    return variant === 'nfi'
      ? 'You can view past orders in Order History. If you’re not signed in yet, sign in first and then open Order History from the navbar.'
      : 'You can view your past orders in Orders. If you’re not signed in yet, sign in first and then open Orders from the navbar.';
  }

  if (/(track|tracking|shipping|delivery|deliver|where is my)/.test(m)) {
    return 'For delivery updates, check your order details in your Orders / Order History. If you don’t see an update yet, it may still be processing.';
  }

  if (/(cart|add to cart|checkout|payment)/.test(m)) {
    return variant === 'nfi'
      ? 'For business checkout help: add items from Products, then open your cart. If you’re signed out, you’ll be prompted to sign in before checkout.'
      : 'For checkout help: add items from Products, then open your cart. If you’re signed out, you’ll be prompted to sign in before checkout.';
  }

  if (/(account|login|sign in|sign up|register|password)/.test(m)) {
    return variant === 'nfi'
      ? 'For business accounts, use the Business (B2B) sign-in or apply page. If you’re having trouble signing in, try resetting your password or verifying the email you used.'
      : 'You can sign in or create an account from the Sign In button. If you’re having trouble, try resetting your password or verifying the email you used.';
  }

  if (/(refund|return|cancel)/.test(m)) {
    return 'If you need to cancel or request a refund, open your order details and review the status. If it’s already processing, support may need to help manually.';
  }

  return 'I can help with orders, delivery, checkout, and account issues. What are you trying to do?';
}

export async function supportChat(req: Request, res: Response): Promise<void> {
  const { message, context } = req.body as SupportChatRequest;
  const variant = context?.variant === 'nfi' ? 'nfi' : 'sfi';

  const reply: SupportChatResponse['reply'] = buildReply(message ?? '', variant);

  // Mock AI: no external provider calls.
  res.json({ success: true, data: { reply } });
}
