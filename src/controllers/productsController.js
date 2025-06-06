import Product from "../models/Product.js";
import Restaurant from "../models/Restaurant.js";

/** productsController.js
 * El controlador de productos debe poder:
 *  - Crear un nuevo producto.
 *  - Obtener un producto existente a partir de:
 *      - Nombre (name)
 *      - Precio (price)
 *  - Obtener un producto por su ID
 *  - Actualizar un producto existente.
 *  - Eliminar un producto exitente.
 */

/** Crear un nuevo producto.
 * endpoint: '/product/create'
 * Validaciones:
 *  - Existan name, description, price y isAvailable
 *  - Precio >= 0
 */

export const CreateNewProduct = async (req, res) => {
  const { name, description, price, isAvailable } = req.body;
  const restaurantId = req.params.restaurantId;

  if (!name || !description || !price || !isAvailable || !restaurantId) {
    //Contesto con un 400 'Bad Request'.
    res
      .status(400)
      .json({ error: "Alguno de los campos no fue ingresado correctamente." });
    return;
  }

  if (price <= 0) {
    res.status(400).json({ error: "El precio debe ser mayor a 0." });
  }

  const newProduct = {
    name,
    description,
    price,
    isAvailable,
    restaurant: restaurantId,
  };

  newProduct.isAvailable = (
    await Restaurant.findById(restaurantId)
  ).isAvailable;

  try {
    const createdProduct = await Product.create(newProduct);
    //Envío un código de estado 201 'Created'.
    res.status(201).json({
      success: "Producto agregado.",
      createdProduct,
    });
  } catch (error) {
    //Si no funciona envío un 500 'Internal Server Error'.
    res
      .status(500)
      .json({ error: "Ocurrió un error al crear el nuevo producto." });
  }
};
/** Obtener productos de un restaurant:
 *    - ID de restaurant (restaurantId)
 * endpoint: /products?restaurantId
 */
export const getProductsByRestaurantId = async (req, res) => {
  const restaurant = req.query;
  if (!restaurant) {
    res.status(400).json({ error: "No se envio restaurantId." });
    return;
  }
  try {
    const products = await Product.find({ restaurant: restaurant });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: `Ocurrió un error al buscar productos del restaurante. ${error.message}`,
    });
  }
};

/** Obtener un producto existente a partir de:
 *    - Nombre (name)
 *    - Precio (price)
 * endpoint: /search/product
 */

export const SearchProduct = async (req, res) => {
  const { name, price } = req.query;

  if (!name && !price) {
    //Devuelvo un código de error 400 'Bad Request'
    res
      .status(400)
      .json({ error: "Alguno de los campos no fue ingresado correctamente." });
    return;
  }

  try {
    const searchedProduct = await Address.findOne({ name: name, price: price });
    if (!searchedProduct) {
      res.status(404).json({ error: "No se encontró el producto." });
      return;
    }

    res.status(200).json({
      success: `Resultado de busqueda de: ${name} ${price})`,
      searchedProduct,
    });
  } catch (error) {
    res.status(500).json({
      error: `Ocurrió un error al buscar el producto. ${error.message}`,
    });
  }
};

/** Obtener un producto por su ID
 * endpoint: /search/product/:id
 * routeParam: id
 */

export const SearchProductById = async (req, res) => {
  const searchId = req.params.id;

  if (!searchId) {
    res
      .status(400)
      .json({ error: "El ID ingresado no es válido o está vacío." });
    return;
  }

  try {
    const searchedProduct = await Product.findById(searchId);
    if (!searchedProduct) {
      res.status(404).json({ error: "No se encontró el producto." });
      return;
    }
    res.status(200).json({
      success: `Resultado de busqueda: ${searchedProduct.name}`,
      searchedProduct,
    });
  } catch (error) {
    res.status(500).json({
      error: `Ocurrió un error al realizar la busqueda - ID: ${searchId} \n ${error.message}`,
    });
  }
};

/** Actualizar un producto existente.
 * Es necesario obtener los datos desde el 'body'.
 * endpoint: /product/update/:id
 * routeParams: id
 * */
export const UpdateProduct = async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    res.status(400).json({ error: "El ID consultado no es válido." });
    return;
  }

  const productFound = null;

  try {
    productFound = await Product.findById(productId);
    if (!productFound) {
      res.status(500).json({
        error: `No se encontró el producto asociado al ID: ${productId}`,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      error: `Ocurrió un error al buscar el producto. ${error.message}`,
    });
  }

  const { newName, newDescription, newPrice, newIsAvailable } = req.body;

  if (!newName && !newDescription && !newPrice && !newIsAvailable) {
    res.status(400).json({
      error:
        "Al menos uno los campos requeridos debe estar completo para actualizar.",
    });
    return;
  }

  // ( ?? ) => Operador de fusión nula. Mantiene el original si el nuevo es Null o Undefined.
  const updatedFields = {
    name: newName ?? productFound.name,
    description: newDescription ?? productFound.description,
    price: newPrice ?? productFound.price,
    isAvailable: newIsAvailable ?? productFound.isAvailable,
  };

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: updatedFields },
      { new: true }
    );
    res.status(200).json({
      success: `El producto se actualizó correctamente.`,
      updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al actualizar.\n ${error.message}` });
  }
};

/** Eliminar un producto exitente.
 * endpoint: /product/delete/:id
 */
export const DeleteProduct = async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    res.status(400).json({ error: "El ID consultado no es válido." });
    return;
  }

  try {
    const exists = await Product.exists({ _id: categoryId });

    if (exists) {
      await Product.findByIdAndDelete(categoryId);
      res.status(200).json({ error: "Se eliminó el producto correctamente." });
    } else {
      res.status(500).json({ error: "No existe producto solicitado." });
    }
  } catch (error) {
    res.status(500).json({
      error: `No es posible procesar esta operación. \n ${error.message}`,
    });
  }
};
