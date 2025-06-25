import mongoose, { Schema } from "mongoose";
import Product from "./Product.js";

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [{
        type: Schema.Types.ObjectId, 
        ref: 'Product'              
      }],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "preparing", "on_the_way", "delivered", "cancelled"],
      default: "pending",
    },
    estimatedDeliveryTime: {
      type: Date,
      default: Date.now
    },
    deliveredAt: {
      type: Date,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
