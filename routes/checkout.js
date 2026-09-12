import { Router } from 'express';
import { createCheckoutSession } from '../controllers/checkoutController.js';
import { checkoutLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/session', checkoutLimiter, createCheckoutSession);

export default router;
