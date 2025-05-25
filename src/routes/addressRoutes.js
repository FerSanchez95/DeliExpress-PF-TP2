import express from 'express';
import {
    CreateNewAddress,
    SearchAddress,
    SearchAddressById,
    UpdateAddress,
    DeleteAddress
} from '../controllers/addressController.js'
import { protegerRuta } from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/search/address', protegerRuta, SearchAddress);
router.get('/search/address/:id', protegerRuta, SearchAddressById);
router.post('/address/create', protegerRuta, CreateNewAddress);
router.post('/address/update/:id', protegerRuta, UpdateAddress);
router.post('/address/delete/:id', protegerRuta, DeleteAddress);

export default router