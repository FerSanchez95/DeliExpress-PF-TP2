import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const conectarBD = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Se conecto a la base de datos correctamente")
    }catch (error){
        console.error("Error al conectar con la base de datos: ", error.message);
    }
}

export default conectarBD
