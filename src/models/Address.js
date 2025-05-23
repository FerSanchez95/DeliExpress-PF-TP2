import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: {
      type: String,
      required: true
    },
    number: {
        type: Number,
        required: true
    },
    floor: {
        type: String
    },
    zipcode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Address', addressSchema);