import express from "express";
import {
  CreateNewOrder,
  GetOrderById,
  getUnassignedOrders,
  assignOrderToDriver,
} from "../controllers/ordersController.js";
import { protegerRuta, requireRole } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/order", protegerRuta, requireRole(['customer']), CreateNewOrder);
router.get("/order/:id", protegerRuta, GetOrderById);
router.get("/search/order-unassigned", protegerRuta, requireRole(['driver']), getUnassignedOrders)
router.patch("/assign-driver", protegerRuta, requireRole(['driver']), assignOrderToDriver)
// router.put("/order/:id", protegerRuta, UpdateOrder);
// router.delete("/order/:id", protegerRuta, DeleteOrder);


export default router;
