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

router.get('/products', protegerRuta, getProductsByRestaurantId);
router.get('/search/product', protegerRuta, SearchProduct);
router.get('/search/product/:id', protegerRuta, SearchProductById);
router.post('/restaurants/:restaurantId/products', protegerRuta, CreateNewProduct);
router.post('/product/update/:id', protegerRuta, UpdateProduct);
router.post('/product/delete/:id', protegerRuta, DeleteProduct);
router.post('/restaurants/:restaurantId/products', protegerRuta, CreateNewProduct);

export default router