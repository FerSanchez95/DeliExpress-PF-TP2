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

router.get('/search/address', SearchAddress);
router.get('/search/address/:id', protegerRuta, SearchAddressById);
router.post('/address', protegerRuta, CreateNewAddress);
router.put('/address/:id', protegerRuta, UpdateAddress);
router.delete('/address/:id', protegerRuta, DeleteAddress);

export default router