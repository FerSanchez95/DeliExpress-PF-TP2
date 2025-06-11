import express from 'express';
import dotenv from 'dotenv';
import restaurantRouter from './routes/restaurantRouter.js'
import userRoutes from '../src/routes/userRoutes.js';
import categoryRoutes from '../src/routes/categoryRoutes.js';
import addressRoutes from '../src/routes/addressRoutes.js';
import productRoutes from '../src/routes/productRoutes.js';

dotenv.config();

const PORT = process.env.PORT;
const deliApp = express();

deliApp.use('/deliapp', restaurantRouter);
deliApp.use('/deliapp', userRoutes);
deliApp.use('/deliapp', categoryRoutes);
deliApp.use('/deliapp', addressRoutes);
deliApp.use('/deliapp', productRoutes);

deliApp.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})