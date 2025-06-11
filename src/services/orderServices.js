const CalculateTotalAmount = (arr) => {
  let total = 0;
  let cantidadTotal = arr.lenght;

  //Compruebo que el array no esté vacío.
  if (cantidadTotal === 0) {
    return 0;
  }
  //Recorro el array y sumo el precio por la cantidad de cada producto.
  arr.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
};

const areAllProductsFromSameRestaurant = (products) => {
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

const isUserDriver = (user) => {
  return user.role === "driver";
};

const isRestaurantAvailable = (restaurant) => {
  return restaurant.isAvailable;
};
