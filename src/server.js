import express from 'express';
import dotenv from 'dotenv';
import restaurantRouter from './routes/restaurantRouter.js'

dotenv.config();

const PORT = process.env.PORT;
const deliApp = express();

deliApp.use('/api/v1', restaurantRouter)

deliApp.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
