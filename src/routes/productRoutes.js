import express from 'express';
import {
    CreateNewProduct,
    SearchProduct,
    SearchProductById,
    UpdateProduct,
    DeleteProduct,
    getProductsByRestaurantId,
} from '../controllers/productsController.js';
import { protegerRuta } from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/search/products', SearchProduct);
router.get('/search/products/:id', SearchProductById);
router.post('/products', protegerRuta, CreateNewProduct);
router.put('/products/:id', protegerRuta, UpdateProduct);
router.delete('/products/:id', protegerRuta, DeleteProduct);
router.get('/search/restaurants/:restaurantId/products', getProductsByRestaurantId);

export default router