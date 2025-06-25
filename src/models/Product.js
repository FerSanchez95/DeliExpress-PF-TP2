import mongoose, {Schema} from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  isAvailable: { 
    type: Boolean, 
    required: true 
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
