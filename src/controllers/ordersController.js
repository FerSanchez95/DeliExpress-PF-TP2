import Order from "../models/Order";
import services from "../services/orderServices.js";
/** orderController.js 
 * El controlador de ordenes de compra debe poder:
 *  - Crear un nueva orden de compra.
 *  - Obtener un producto existente a partir de:
 *      - Nombre (name)
 *      - Precio (price)
 *  - Obtener un producto por su ID
 *  - Actualizar un producto existente.
 *  - Eliminar un producto exitente.
 */

/** Crear un nueva orden de compra.
 * endpoint: '/order/create'
 */

export const CreateNewOrder = async(req, res) => {
    

    const {products, notes, } = req.body;

    if(!name || !description || !price || !isAvailable){
        //Contesto con un 400 'Bad Request'.
        res.status(400).json({error: "Alguno de los campos no fue ingresado correctamente."})
        return
    }

    const newAddress = {
        name,
        description, 
        price, 
        isAvailable
    }

    try{
        const createdOrder = await Order.create(newAddress);
        //Envío un código de estado 201 'Created'.
        res.status(201).json({
            success: "Orden generada.",
            createdOrder
        });
    } catch (error) {
        //Si no funciona envío un 500 'Internal Server Error'.
        res.status(500).json({error: "Ocurrió un error al crear La orden de compra."})
    }
}