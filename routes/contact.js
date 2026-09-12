import { Router } from 'express';
import { submitContactForm } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/', contactLimiter, submitContactForm);

export default router;
