import express from 'express';
import {
    CreateNewProduct,
    SearchProduct,
    SearchProductById,
    UpdateProduct,
    DeleteProduct
} from '../controllers/productsController.js';
import { protegerRuta } from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/search/product', protegerRuta, SearchProduct);
router.get('/search/product/:id', protegerRuta, SearchProductById);
router.post('/product/create', protegerRuta, CreateNewProduct);
router.post('/product/update/:id', protegerRuta, UpdateProduct);
router.post('/product/delete/:id', protegerRuta, DeleteProduct);

export default router