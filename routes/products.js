import { Router } from 'express';
import { listProducts, showProduct } from '../controllers/productsController.js';

const router = Router();

router.get('/', listProducts);
router.get('/:slug', showProduct);

export default router;
