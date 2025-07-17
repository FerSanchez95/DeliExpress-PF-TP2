import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import {CalculateTotalAmount, 
        areAllProductsFromSameRestaurant, 
        isUserDriver, 
        isRestaurantAvailable} 
from "../services/orderServices.js";
/** orderController.js
 * El controlador de ordenes de compra debe poder:
 *  - Crear un nueva orden de compra. [X]
 *  - Obtener un producto existente a partir de:
 *      - Nombre (name)
 *      - Precio (price)
 *  - Obtener un producto por su ID [X]
 *  - Actualizar un producto existente.[X]
 *  - Eliminar un producto exitente. [X]
 */

/** Crear un nueva orden de compra.
 * endpoint: '/order/create'
 */

export const CreateNewOrder = async (req, res) => {

  // products => [{productId, quantity}]
  // notes => string

  const { products, notes } = req.body;

  if (!products || !notes) {
    //Contesto con un 400 'Bad Request'.
    res
      .status(400)
      .json({ error: "Alguno de los campos no fue ingresado correctamente." });
    return;
  }

  if (products.length === 0) {
    //Contesto con un 400 'Bad Request'.
    res.status(400).json({ error: "Debe ingresar al menos un producto." });
    return;
  }

  //
  const productsTotalAmount = await CalculateTotalAmount(products);
  const productIds = products.map(item => item.productId);
  console.log("total: ", productsTotalAmount);

  const newOrder = {
    products: productIds,
    totalAmount: productsTotalAmount,
    notes,
    status: "pending",
    customer: req.usuario.id, // Asumiendo que el usuario está autenticado y su ID está en req.user
    driver: null, // Inicialmente no hay conductor asignado
    deliveredAt: null, // Inicialmente no hay fecha de entrega
  };

  if (await isRestaurantAvailable(products[0])) {
    if (areAllProductsFromSameRestaurant(products)) {
      try {
        const createdOrder = await Order.create(newOrder);
        //Envío un código de estado 201 'Created'.
        res.status(201).json({
          success: "Orden generada.",
          createdOrder,
        });
      } catch (error) {
        console.log(error)
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

export const UpdateOrderProduct = async (req, res) => {
  const { orderId, productId, updatedProduct } = req.body;

  if (!orderId || !productId || !updatedProduct){
    res.status(400).json({error: "Faltan datos para completar la acción requerida."});
    return;
  }

  try{
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({error: "No se pudo encontrar la orden."});
      return;
    }
    
    if (order.products.indexOf === -1) {
      res.status(404).json({error: "La orden no posee productos para actualizar."});
      return;
    }
    //Recorrer el array y buscar el producto con el ID
    const productIndex = order.products.findIndex(p => p._id === productId);

    //Uso el index para actualizar el producto en la orden.
    order.products[productIndex] = updatedProduct;

    //Vuelvo a calcular el valor de la orden.
    CalcularTotalYGuardarOrden(order);
  } catch (error) {
    res.status(500).json({
      error: `Ocurrió un error al actualizar el producto de la orden.\n${error.message}`,
    });
  }

}

export const DeleteProductFromOrder = async (req, res) => {
  const { orderId, productId } = req.body;

  if (!orderId || !productId) {
    res.status(400).json({ error: "Faltan datos para eliminar el producto." });
    return;
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ error: "Orden no encontrada." });
      return;
    }

    //Elimino del array de productos el producto selecionado.
    order.products = order.products.filter(
      (product) => product._id.toString() !== productId
    );

    if (order.products.length === 0) {
      await Order.deleteOne({ _id: orderId });
      res.status(200).json({ success: "Orden eliminada, no quedan productos." });
    } else {
      // Actualizo el total de la orden después de eliminar el producto.
      CalcularTotalYGuardarOrden(order);
      res.status(200).json({ success: "Producto eliminado de la orden." });
    }
  } catch (error) {
    res.status(500).json({
      error: `Ocurrió un error al eliminar el producto de la orden.\n${error.message}`,
    });
  }
}

export const getUnassignedOrders = async (req, res) => {
    try {
        const unassignedOrders = await Order.find({ driver: null });

        if (unassignedOrders.length === 0) {
            return res.status(200).json({ message: "No hay órdenes no asignadas en este momento." });
        }

        res.status(200).json({
            success: `Se encontraron ${unassignedOrders.length} órdenes no asignadas.`,
            orders: unassignedOrders,
        });

    } catch (error) {
        console.error("Error al obtener órdenes no asignadas:", error);
        res.status(500).json({
            error: `Ocurrió un error al buscar órdenes no asignadas. ${error.message}`,
        });
    }
} 

export const assignOrderToDriver = async (req, res) => {
    try {
        const { orderId } = req.body;
        const { driverId } = req.body;  

        if (!driverId) {
            return res.status(400).json({ error: "El ID del driver es requerido para la asignación." });
        }


        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                driver: driverId,   
                status: 'assigned',
                updatedAt: new Date() 
            },
            {
                new: true,       
                runValidators: true 
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Orden no encontrada." });
        }

        res.status(200).json({
            success: `Orden ${updatedOrder._id} asignada exitosamente al driver ${driverId}.`,
            order: updatedOrder, // Devuelve la orden actualizada
        });

    } catch (error) {
        console.error("Error al asignar orden:", error);
        // Manejo específico para errores de formato de ID
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Formato de ID de orden o driver inválido.' });
        }
        res.status(500).json({
            error: `Ocurrió un error al asignar la orden. ${error.message}`,
        });
    }
};


const CalcularTotalYGuardarOrden = async(orden) => {
  orden.totalAmount = calculateTotalAmount(orden.products);
  await orden.save();
}

export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  const validStatuses = Order.schema.path("status").enumValues;

  const allowedTransitions = {
    pending: ["assigned", "cancelled"],
    assigned: ["preparing", "cancelled"],
    preparing: ["on_the_way", "cancelled"],
    on_the_way: ["delivered", "cancelled"],
    delivered: [],
    cancelled: []
  };
  
  if (!orderId || !status) {
    return res.status(400).json({ error: "Se requiere orderId y status para continuar." });
  }

  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ error: `Estado no válido. Estados permitidos: ${validStatuses.join(", ")}` });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada." });
    }

    const currentStatus = order.status;

    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return res
        .status(400)
        .json({ error: `La orden no puede cambiar de "${currentStatus}" a "${status}".` });
    }

    order.status = status;

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    res
      .status(200)
      .json({ success: `La orden ${orderId} cambió al estado ${status}.`, order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Error al actualizar el estado de la orden: ${error.message}` });
  }
};
