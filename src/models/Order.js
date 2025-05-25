import mongoose, {Schema} from "mongoose";
import Product from "./Product.js";

const orderSchema = new mongoose.Schema({
  products: { 
    type: [Product], 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDeliveryTime: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);