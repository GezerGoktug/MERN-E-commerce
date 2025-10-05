import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  locationInfo: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },

    zipCode: {
      type: String,
      required: true,
    },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  payment: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["CASH_ON_DELIVERY", "STRIPE"],
    default: "CASH_ON_DELIVERY",
    required: true,
  },
  createdAt:{
    type:Date,
    required:true,
    default:Date.now
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

export const Order = mongoose.model("Order", orderSchema);
