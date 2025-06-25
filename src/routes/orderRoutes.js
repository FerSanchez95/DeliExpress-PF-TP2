import express from "express";
import {
  CreateNewOrder,
  GetOrderById,
} from "../controllers/ordersController.js";
import { protegerRuta } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/order", protegerRuta, CreateNewOrder);
router.get("/order/:id", protegerRuta, GetOrderById);
// router.put("/order/:id", protegerRuta, UpdateOrder);
// router.delete("/order/:id", protegerRuta, DeleteOrder);


export default router;
