
const CalculateTotalAmount = (arr) =>{
    
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
}