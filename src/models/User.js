import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'driver', 'owner'],
    default: 'customer'
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);