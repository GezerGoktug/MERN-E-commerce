import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
  },
  subImages: {
    type: [String],
    maxLength: 4,
    required: true,
  },
  sizes: {
    type: [String],
    enum: ["SMALL", "MEDIUM", "LARGE", "XLARGE", "XXLARGE"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Kids", "Men", "Women"],
    required: true,
  },
  subCategory: {
    type: String,
    enum: ["Topwear", "Bottomwear", "Winterwear"],
    required: true,
  },
  comments: [
    {
      content: {
        type: String,
        required: true,
        maxLength: 250,
      },
      rating: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
      user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
    },
  ],
});

export const Product = mongoose.model("Product", productSchema);
