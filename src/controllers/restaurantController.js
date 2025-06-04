import Restaurant from "../models/Restaurant.js"

/** productsController.js 
 * El controlador de restaurante debe poder:
 *  - Crear un nuevo restaurante.
 *  - Obtener un restaurante por su ID
 *  - Actualizar un restaurante existente.
 *  - Eliminar un restaurante exitente.
 */


/** Obtener todos los restaurantes.
 *  endpoint: '/restaurants'
 */
export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find()
        console.log("retrieving all restaurants")
        res.status(200).json(restaurants)
    } catch(error) {
        res.status(500).json({"message": "error retrieving restaurants."})
    }
}

/** Obtiene un restaurante por id.
 * endpoint: '/restautants/:restaurantId'
 */
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

/** Crear un restaurante .
 * endpoint: POST '/restaurants'
 * Validaciones:
 *  - Existan restaurant, phone, address
 */
export const postRestaurant = async (req, res) => {
    const restaurant = req.body
    if(!restaurant || !restaurant.phone || !restaurant.address) {
        return res.status(400).json({"message": "error in body object"})
    }

    if(restaurant.phone)

    try {    
        const newRestaurant = await Restaurant.create(restaurant)
        res.status(201).json(newRestaurant)
    } catch(error) {
        res.status(500).json({"message": "Error in database."})
    }
}

/** Actualizar un restaurante por id.
 * endpoint: PUT '/restautantes/:restaurantId'
 */
export const updateRestaurantById = async (req, res) => {
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

    if (updatedUser) {
        console.log('Documento reemplazado con éxito (findOneAndReplace):', updatedUser);
    } else {
        console.log('No se encontró el documento para reemplazar.');
    }

    if(!updatedRestaurant) {
        return res.status(400).json({"message": "not found resstaurant with id: " + id})
    }
    res.status(204).send()
}


