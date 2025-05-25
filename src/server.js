import express from 'express';
import dotenv from 'dotenv';
import userRoutes from '../src/routes/userRoutes.js';
import categoryRoutes from '../src/routes/categoryRoutes.js';
import addressRoutes from '../src/routes/addressRoutes.js';
import productRoutes from '../src/routes/productRoutes.js';

dotenv.config();

const puerto = process.env.PORT;

const deliApp = express();

deliApp.get('/', (req, res) => {
    res.send('!Delivery!');
});
deliApp.use('/deliapp', userRoutes);
deliApp.use('/deliapp', categoryRoutes);
deliApp.use('/deliapp', addressRoutes);
deliApp.use('/deliapp', productRoutes);

deliApp.listen(puerto, () => { console.log(`https://localhost:${puerto}`)} );
