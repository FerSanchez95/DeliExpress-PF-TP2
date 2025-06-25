import Restaurant from "../models/Restaurant.js";
import Product from "../models/Product.js";

export const CalculateTotalAmount = async (productIds) => {
  let total = 0;

  let cantidadTotal = productIds.lenght;

  //Compruebo que el array no esté vacío.
  if (cantidadTotal === 0) {
    return 0;
  }
  //Recorro el array y sumo el precio por la cantidad de cada producto.
  productIds.forEach(async (item) => {
    const product = await Product.findById(item.productId);
    total += product.price * item.quantity;
  });
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
  return user.role === "driver";
};

export const isRestaurantAvailable = async (productArr) => {
  const product = await Product.findById(productArr.productId)
  const restaurant = await Restaurant.findById(product.restaurantId)
  return restaurant.isOpen;
};
