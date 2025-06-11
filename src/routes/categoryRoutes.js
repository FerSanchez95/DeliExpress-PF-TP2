import express from 'express';
import {
    CreateNewCategory,
    getCategories,
    SearchCategoryByName,
    SearchCategoryById,
    UpdateCategory,
    DeleteCategory
} from '../controllers/categoryController.js';
import { protegerRuta } from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/categories', protegerRuta, getCategories);
router.get('/search/categories/:name', protegerRuta, SearchCategoryByName);
router.get('/search/categories/:id', protegerRuta, SearchCategoryById);
router.post('/categories', protegerRuta, CreateNewCategory);
router.put('/categories/:id', protegerRuta, UpdateCategory);
router.delete('/categories/:id', protegerRuta, DeleteCategory);

export default router;
 
