import mongoose from "mongoose";

const userFavouriteProductsSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },
    products: [{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Product",
    }],
})


export const UserFavouriteProducts = mongoose.model('UserFavouriteProducts', userFavouriteProductsSchema);