import mongoose from "mongoose";

const collection = 'carts';
const productSubSchema = new mongoose.Schema({
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'products',
    },
    quantity: {
        type: Number,
        default: 1,
    },
}, { _id: false });

const cartSchema = new mongoose.Schema(
    {
        cartDetail: {
            type: [productSubSchema],
            default: [],
        },
    },
    { timestamps: true,
        strict: 'throw',
        versionKey: false }
);

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;


