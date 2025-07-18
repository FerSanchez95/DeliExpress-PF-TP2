import mongoose, {Schema} from "mongoose";
import Category from "./Category.js";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  rating: {
    type: Number
  },
  phone: {
    type: Number,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  }]
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);