import Restaurant from "../models/Restaurant.js"

export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find()
        console.log("retrieving all restaurants")
        res.status(200).json(restaurants)
    } catch(error) {
        res.status(500).json({"message": "error retrieving restaurants."})
    }
}

export const getRestaurantById = async (req, res) => {
    const id = req.params.restaurantId
    if(!id) {
        return res.status(400).json({"message": "Error in parameter."})
    }
    try {
        const restaurant = await Restaurant.findById(id)
        if(restaurant) {
            res.status(200).json(restaurant)
        } else {
            res.status(404).json({"message": "restaurant not found"})
        } 
    } catch(error) {
        console.log(error.message);
        res.status(500).json({"message": "Error in database."})
    }
}

export const postRestaurant = async (req, res) => {
    const restaurant = req.body
    if(!restaurant) {
        return res.status(400).json({"message": "error in body object"})
    }
    try {    
        const newRestaurant = await Restaurant.create(restaurant)
        res.status(201).json(newRestaurant)
    } catch(error) {
        res.status(500).json({"message": "Error in database."})
    }
}

export const updateRestaurantById = (req, res) => {
    const restaurantId = req.params.restaurantId
    const newRestaurant = req.body

    if(!id || !restaurant) {
        return res.status(400).json({"message": "error in parameters"})
    }

    const updatedRestaurant = await User.findOneAndReplace(
        { _id: restaurantId },
        newRestaurant,
        { new: true } 
    );

    if(!updatedRestaurant) {
        return res.status(400).json({"message": "not found resstaurant with id: " + id})
    }
    res.status(204).send()
}


