import express from 'express'
import {
    getRestaurants,
    getRestaurantById,
    postRestaurant,
    updateRestaurantById
} from '../controllers/restaurantController.js'

const router = express.Router()

router.get('/restaurants', getRestaurants)
router.get('/restaurants/:restaurantId', getRestaurantById)
router.post('/restaurants', postRestaurant)
router.put('/restaurants/:restaurantId', updateRestaurantById)

export default router