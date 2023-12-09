import mongoose from "mongoose";

const collection = "Products";

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    thumbnail: {type: [String], default:[]},
    status:  {type: Boolean, default: true},
    category: {type: String, required: true},
    code: {type: String, required: true, unique: true},
    stock: {type: Number, required: true},
    price: {type: Number, required: true}   
}, {
    strict: 'throw',
    versionKey: false
  }

)

const productModel = mongoose.model(collection, productSchema);

export default productModel;