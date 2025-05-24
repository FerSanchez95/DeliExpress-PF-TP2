import category from '../models/Category.js'

/** categoryController.js
 * El controlador de la categoría debe poder:
 *  _ Crear una nueva categoría. [X]
 *  _ Devolver todas las categorías persistidas anteriormente.[X]
 *  _ Devolver (buscar) una categoría por nombre o ID. [X]
 *  _ Actualizar una categoría existente.[X]
 *  _ Eliminar una categoría existente. [X]
 */ 


/** Crear una nueva categoría.
 * endpoint /category/create/
 */ 

export const CreateNewCategory = async(req, res) => {
    
    //Tomo los argumentos que se pasan a trevés del body.
    const {name, description} = req.body;

    //Verifico que ninguno de los valores sea 'falsy'
    if(!name || !description){
        //Contesto con un 400 'Bad Request'.
        res.status(400).json({error: "Alguno de los campos no fue ingresado correctamente."})
        return
    }
    
    //Creo un nuevo objeto tipo 'Category' para guardarlo en la BD.
    const newCategory = {
        name,
        description
    }

    //Intento persistir la nueva categoría.
    try{
        const createdCategory = await category.create(newCategory);
        //Envío un código de estado 201 'Created'.
        res.status(201).json( createdCategory, {success: "La nueva categoría se creó correctamente."});
    } catch (error) {
        //Si no funciona envío un 500 'Internal Server Error'.
        res.status(500).json({error: "Ocurrió un error al crear la neva categoría."})
    }
}

/** Devolver todas las categorías persistidas anteriormente.
 * endpoint: /category/
 */ 
export const getCategories = async(req, res) =>{

    try{
        const categoryList = await category.find();
        res.status(200).json(categoryList);
    } catch (error) {
        res.status(500).json({error: "Parece que no hay categorías cargadas."})
    }
}

/** Devolver (buscar) una categoría por nombre.
 * endpoint: /category/search/:name
 * routeParam: name
 */

export const SearchCategoryByName = async(req,res) =>{

    //Tomo el nombre desde los parámetros.
    const searchName = req.params.name;

    // verifico que el nombre obtenido no sea un falsy.
    if(!searchName){
        //Devuelvo un código de error 400 'Bad Request'
        res.status(400).json({error: "El nombre ingresado no es válido o está vacío."});
        return
    }

    //Intento realizar la busqueda de la categoría utilizando el nombre
    // que se pasó anteriormente.
    try {
        const searchedCategory = await category.findOne({name: searchName});
        //Respondo con la categoría encontrada y un código de estado 200 'Ok' 
        res.status(200).json(searchedCategory, {success: `Resultado de busqueda de: ${searchedCategory.name}`});
    } catch (error){
        //Respodo con un código de error 500 'internal Server Error'.
        res.status(500).json({error: `No se encontro una categoría ${searchName}`});
    }
}

/** Devolver (buscar) una categoría por nombre.
 * endpoint: /category/search/:id
 * routeParam: id
 */ 

export const SearchCategoryById = async(req,res) =>{

    //Tomo el ID desde los parámetros.
    const searchId = req.params.id;

    //Verifico que el nombre obtenido no sea un falsy.
    if(!searchId){
        //Devuelvo un código de error 400 'Bad Request'
        res.status(400).json({error: "El ID ingresado no es válido o está vacío."});
        return
    }

    /**
     * Intento realizar la busqueda de la categoría 
     * utilizando el nombre que se pasó anteriormente.
    */
    try {
        const searchedCategory = await category.findById(searchId);
        //Respondo con la categoría encontrada y un código de estado 200 'Ok' 
        res.status(200).json(searchedCategory, {success: `Resultado de busqueda de: ${searchedCategory.name}`});
    } catch (error){
        //Respodo con un código de error 500 'internal Server Error'.
        res.status(500).json({error: `No se encontro una categoría con un ID: ${searchId}`});
    }
}

/**Actualizar una categoría existente.
 * endpoint: /category/update/:id?name=&description=
 * routeParams: id
 * querysParams: name, description
 * */
export const UpdateCategory = async(req, res) =>{
    
    //Primero obtengo el ID de la categoría.
    const categoryId = req.params.id

    //Valido que el ID obtenido no sea falsy.
    if(!categoryId){
        //Devuelvo un código de estado 400 'Bad Request'.
        res.status(400).json({error: "El ID consultado no es válido."})
        return
    }

    //intento obtener la categoría por su ID
    const categoryFound = null;
    
    try{
        categoryFound = await category.findById(categoryId);
    } catch (error) {
        res.status(500).json({error: "La categoría a actualizar no fue encontrada."})
    }

    //Obtengo los valores que se quieren actualizar.
    const {newName, newDescription} = req.query

    /** Verifico que los 'query params' no sean Undefined
     * Se cambia la evaluación de un 'or' ( || ) a un 'and' 
     * ( && ), porque se puede querer actualizar un nombre y
     * no una descrición o viceversa. Pero en ningún caso se
     * debe actualizar si ambos parámetros están vacíos.
     */
    if(!newName && !newDescription){
        res.status(400).json({error: "Nombre o descrición deben esta completos para actualizar."})
        return
    }

    // Intento actualizar la categoría
    try {
        const updatedCategory = await category.findOneAndUpdate(
            {_id: categoryId}, 
            {$set: {
                name: newName? newName: categoryFound.name,
                description: newDescription? newDescription: categoryFound.description
                }
            }
        );

        res.status(200).json(updatedCategory, {success: `La categoría se actualizó correctamente.`});

    } catch (error){
        res.status(500).json({error: "Ocurrió un error al actualizar."})
    }
}

/** Eliminar una categoría existente.
 * endpoint: /category/delete/:id
 */ 
export const DeleteCategory = async(req, res) => {

    //Obtengo el ID de la categría
    const categoryId = req.params.id

    //Valido que el ID obtenido no sea falsy.
    if(!categoryId){
        //Devuelvo un código de estado 400 'Bad Request'.
        res.status(400).json({error: "El ID consultado no es válido."})
        return
    }
    
    //Intento eliminar la categoria correspondiente al ID
    try{
        // Compruebo que la categoría exsita.
        const exists = await category.exists({_id: categoryId});
  
        if (exists) {
            await category.findByIdAndDelete(categoryId);
            res.status(200).json({error: "Se eliminó la categoría correctamente."});
        } else {
            res.status(500).json({error: "No existe la categoríal selecionada."})
        }
    } catch (error) {
        res.status(500).json({error: "No es posible procesar esta operación."});
    }
}

