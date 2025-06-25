import express from 'express';
import dotenv from 'dotenv';
import restaurantRouter from './routes/restaurantRouter.js'
import userRoutes from '../src/routes/userRoutes.js';
import categoryRoutes from '../src/routes/categoryRoutes.js';
import addressRoutes from '../src/routes/addressRoutes.js';
import productRoutes from '../src/routes/productRoutes.js';
import orderRoutes from '../src/routes/orderRoutes.js'
import connectDatabase from './config/database.js';

dotenv.config();


const PORT = process.env.PORT || 3000;
const deliApp = express();

connectDatabase()
deliApp.use(express.json());
deliApp.use(express.urlencoded({ extended: true }));

deliApp.use('/deliapp', restaurantRouter);
deliApp.use('/deliapp', userRoutes);
deliApp.use('/deliapp', categoryRoutes);
deliApp.use('/deliapp', addressRoutes);
deliApp.use('/deliapp', productRoutes);
deliApp.use('/deliapp', orderRoutes);

deliApp.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})