import Restaurant from "../models/Restaurant.js";
import Product from "../models/Product.js";

export const CalculateTotalAmount = async(productIds) => {
  let total = 0;

  //Compruebo que el array no esté vacío.
  if (productIds.lenght === 0) {
    return 0;
  }
  // Creo un array de promesas que van a procesar cada uno de los 
  // productos de la orden.
  const arrayPromesas = productIds.map(async(item) => {
    
    // Obtenog el producto de la base de datos
    const producto = await Product.findById(item.productId);

    // Verifico que el producto se encontró.
    if (!producto) {
      // Advertencia por consola.
      console.warn("No se encontró el producto");
    }

    // si el producto existe devuelvo el total 
    return producto.price * item.quantity;
  })

  // Obtengo un array de subtotales propios de cada producto ingresado.
  // Promise.all va a "esperer" a que terminen de procesarse todas las 
  // promesas en el array de promesas antes de decolver el resultado.
  const subtotales = await Promise.all(arrayPromesas);

  // ahora utilizo el método 'reduce' para obtener el valor total a partir
  // del array de subtotales. 0 es el valor inicial que pide el método.
  total = await subtotales.reduce((acumulado, valorActual) => acumulado + valorActual, 0);

  return total;
};

export const areAllProductsFromSameRestaurant = (products) => {
  var isSame = true;

  var i = 0;
  while (i < products.length && isSame) {
    if (products[i].restaurant !== products[0].restaurant) {
      isSame = false;
    }
    i++;
  }

  return isSame;
};

export const isUserDriver = (user) => {
  return user.rol === "driver";
};

export const isRestaurantAvailable = async (productArr) => {
  const product = await Product.findById(productArr.productId);
  const restaurant = await Restaurant.findById(product.restaurantId);
  return restaurant.isOpen;
};
