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

router.get('/category', protegerRuta, getCategories);
router.get('/search/category/:name', protegerRuta, SearchCategoryByName);
router.get('/search/category/:id', protegerRuta, SearchCategoryById);
router.post('/category/create', protegerRuta, CreateNewCategory);
router.post('/category/update/:id?name=&description=', protegerRuta, UpdateCategory);
router.post('/category/delete/:id', protegerRuta, DeleteCategory);

export default router;
 
