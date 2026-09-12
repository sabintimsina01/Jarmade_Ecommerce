import { Router } from 'express';
import { showConfirmationOrder } from '../controllers/ordersController.js';

const router = Router();

router.get('/confirmation', showConfirmationOrder);

export default router;
