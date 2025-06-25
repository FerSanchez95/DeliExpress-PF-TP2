import Address from "../models/Address.js";

/** addressController.js 
 * El controlador de direcciones debe poder:
 *  - Crear una nueva dirección.
 *  - Obtener una dirección existente a partir de:
 *      - Calle (street)
 *      - Número (number)
 *      - Código postal (zipcode).
 *  - Obtener una dirección existente por su ID
 *  - Actualizar una dirección existente.
 *  - Eliminar un dirección exitente.
 * 
 */

/** Crear una nueva dirección.
 * endpoint: '/address/create'
 */

export const CreateNewAddress = async(req, res) => {
    

    const {street, number, floor, zipcode, city, province} = req.body;

    if(!street || !number || !zipcode || !city || !province){
        //Contesto con un 400 'Bad Request'.
        res.status(400).json({error: "Alguno de los campos no fue ingresado correctamente."})
        return
    }

    const newAddress = {
        street,
        number, 
        floor, 
        zipcode, 
        city, 
        province
    }

    try{
        const createdAddress = await Address.create(newAddress);
        //Envío un código de estado 201 'Created'.
        res.status(201).json({
            success: "Dirección agregada correctamente.",
            createdAddress
        });
    } catch (error) {
        console.log(error);
        //Si no funciona envío un 500 'Internal Server Error'.
        res.status(500).json({error: `Ocurrió un error al crear la neva dirección. ${error.messege}`});
    }
}



/** Obtener una dirección existente a partir de:
 *      - Calle (street)
 *      - Número (number)
 *      - Código postal (zipcode).
 * endpoint: /search/address?street&number&zipcode
 */

export const SearchAddress = async(req,res) =>{

    const {street, number, zipcode} = req.query

    if(!street && !number && !zipcode ){
        //Devuelvo un código de error 400 'Bad Request'
        res.status(400).json({error: "Al menos uno de los campos debe ser ingresado."});
        return
    }

    try {
        const searchedAddress = await Address.findOne({street: street, number: number, zipcode: zipcode});
        if(!searchedAddress){
            res.status(404).json({error: `No se encontro la dirección ${street} ${number} - (${zipcode})`});
            return
        }
        res.status(200).json({
            success: `Resultado de busqueda de: ${street} ${number} - (${zipcode})`, 
            searchedAddress
        });
    } catch (error){
        res.status(500).json({error: `Ocurrió un error al procesar la busqueda. \n ${error.messege}`});
    }
}

/** Obtener una dirección por ID.
 * endpoint: /search/address/:id
 * routeParam: id
 */ 

export const SearchAddressById = async(req,res) =>{

    const searchId = req.params.id;

    if(!searchId){
        res.status(400).json({error: "El ID ingresado no es válido."});
        return
    }

    try {
        const searchedAddress = await Address.findById(searchId);
        if(!searchedAddress){
            res.status(404).json({error: `No se encontro una dirección con un ID: ${searchId}`});
            return
        }
        res.status(200).json({
            success: `Resultado de busqueda: ${searchedAddress.street} ${searchedAddress.number}`, 
            searchedAddress
        });
    } catch (error){
        res.status(500).json({error: `Ocurrió un error al procesar la busqueda.\n${error.message}` });
    }
}

/** Actualizar una dirección existente.
 * Es necesario obtener los datos desde el 'body'.
 * endpoint: /address/update/:id
 * routeParams: id
 * */
export const UpdateAddress = async(req, res) =>{

    const addressId = req.params.id

    if(!addressId){
        res.status(400).json({error: "El ID consultado no es válido."})
        return
    }

    const addressFound = null;
    
    try{
        addressFound = await Address.findById(addressId);
        if(!addressFound){
            res.status(404).json({error: "No se encontró la dirección."})
            return
        }
        // Si no existe la dirección, devuelvo un 404 'Not Found'.
    } catch (error) {
        res.status(500).json({error: `Ocurrió un error al procesar la solicitud.\n${error.message}`})
    }

    const {newStreet, newNumber, newFloor, newZipcode, newCity, newProvince} = req.body

    if(!newStreet && !newNumber && !newZipcode && !newCity && !newProvince){
        res.status(400).json({error: "Al menos uno de los campos debe ser ingresado para poder actualizar."});
        return
    }

    // ( ?? ) => Operador de fusión nula. Mantiene el original si el nuevo es Null o Undefined.
    const updatedFields = {
                street: newStreet ?? addressFound.street,
                number: newNumber ?? addressFound.number,
                floor: newFloor ?? addressFound.floor,
                zipcode: newZipcode ?? addressFound.zipcode,
                city: newCity ?? addressFound.city,
                province: newProvince ?? addressFound.province
            }

    try {
        const updatedAddress = await Address.findOneAndUpdate(
            {_id: addressId}, 
            {$set: updatedFields},
            {new: true}
        );
        res.status(200).json({
            success: `La dirección se actualizó correctamente.`, 
            updatedAddress
        });
    } catch (error){
        res.status(500).json({error: `Ocurrió un error al actualizar.\n${error.message}`});
    }
}

/** Eliminar un dirección exitente.
 * endpoint: /category/delete/:id
 */ 
export const DeleteAddress = async(req, res) => {

    const addressId = req.params.id

    if(!addressId){
        res.status(400).json({error: "El ID consultado no es válido."})
        return
    }
    
    try{
        const exists = await Address.exists({_id: categoryId});
  
        if (exists) {
            await Address.findByIdAndDelete(categoryId);
            res.status(200).json({error: "Se eliminó la dirección correctamente."});
        } else {
            res.status(500).json({error: "No existe la dirección seleccionada."})
        }
    } catch (error) {
        res.status(500).json({error: `Ocurrió un error al procesar la operación.\n${error.message}`});
    }
}