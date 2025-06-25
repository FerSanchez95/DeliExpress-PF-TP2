import express from 'express';
import {
    CreateNewProduct,
    SearchProductById,
    UpdateProduct,
    DeleteProduct,
    getProductsByRestaurantId,
} from '../controllers/productsController.js';
import { protegerRuta } from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/search/products', getProductsByRestaurantId);
router.get('/search/products/:id', SearchProductById);
router.post('/products', protegerRuta, CreateNewProduct);
router.put('/products/:id', protegerRuta, UpdateProduct);
router.delete('/products/:id', protegerRuta, DeleteProduct);

export default router