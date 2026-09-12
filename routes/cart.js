import { Router } from 'express';
import { addCartItem, deleteCartItem, showCart, updateCartItem } from '../controllers/cartController.js';
import { cartMutationLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.get('/', showCart);
router.post('/items', cartMutationLimiter, addCartItem);
router.patch('/items/:productId', cartMutationLimiter, updateCartItem);
router.delete('/items/:productId', cartMutationLimiter, deleteCartItem);

export default router;
