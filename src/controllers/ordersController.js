import Order from "../models/Order";
import User from "../models/User.js";
import Product from "../models/Product.js";
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

export const CreateNewOrder = async (req, res) => {
  const { products, notes } = req.body;

  if (!products || !notes) {
    //Contesto con un 400 'Bad Request'.
    res
      .status(400)
      .json({ error: "Alguno de los campos no fue ingresado correctamente." });
    return;
  }

  const newOrder = {
    products,
    notes,
    totalAmount: services.calculateTotalAmount(products),
    status: "pending",
    estimatedDeliveryTime: services.calculateEstimatedDeliveryTime(),
    customer: req.user._id, // Asumiendo que el usuario está autenticado y su ID está en req.user
    driver: null, // Inicialmente no hay conductor asignado
    deliveredAt: null, // Inicialmente no hay fecha de entrega
  };

  if (isRestaurantAvailable(products[0].restaurant)) {
    if (areAllProductsFromSameRestaurant(products)) {
      try {
        const createdOrder = await Order.create(newOrder);
        //Envío un código de estado 201 'Created'.
        res.status(201).json({
          success: "Orden generada.",
          createdOrder,
        });
      } catch (error) {
        //Si no funciona envío un 500 'Internal Server Error'.
        res
          .status(500)
          .json({ error: "Ocurrió un error al crear La orden de compra." });
      }
    } else {
      res.status(400).json({
        error: "Todos los productos deben pertenecer al mismo restaurante.",
      });
    }
  } else {
    res.status(400).json({
      error: "El restaurante no está disponible para recibir pedidos.",
    });
  }
};

export const GetOrderById = async (req, res) => {
  const orderId = req.params.id;

  if (!orderId) {
    res.status(400).json({ error: "El ID ingresado no es válido." });
    return;
  }

  try {
    const searchedOrder = await Order.findById(orderId);
    if (!searchedOrder) {
      res.status(404).json({
        error: `No se encontro una orden con un ID: ${orderId}`,
      });
      return;
    }
    res.status(200).json({
      success: `Productos: ${searchedOrder.products}`,
      searchedOrder,
    });
  } catch (error) {
    res.status(500).json({
      error: `Ocurrió un error al procesar la busqueda.\n${error.message}`,
    });
  }
};
