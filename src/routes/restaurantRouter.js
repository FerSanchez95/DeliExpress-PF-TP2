import express from 'express'
import {
    getRestaurants,
    getRestaurantById,
    postRestaurant,
    updateRestaurantById
} from '../controllers/restaurantController.js'

import { protegerRuta } from '../../middlewares/authMiddlewares.js';
import { authenticateUser } from './middleware/auth.js';
import { requireRole } from '../../middlewares/checkRoles.js';

const router = express.Router()

router.get('/restaurants', getRestaurants)
router.get('/search/restaurants/:restaurantId', getRestaurantById)
router.post('/restaurants', protegerRuta, authenticateUser ,requireRole(['owner']), postRestaurant)
router.put('/restaurants/:restaurantId', protegerRuta, authenticateUser, requireRole(['owner']), updateRestaurantById)

export default router