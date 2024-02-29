import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const productSchema = new mongoose.Schema(
      {
          title: {type: String, required: true},
          description: {type: String, required: true},
          thumbnail: {type: [String], default:[]},
          status:  {type: Boolean, default: true},
          category: {type: String, required: true},
          code: {type: String, required: true, unique: true},
          stock: {type: Number, required: true},
          price: {type: Number, required: true},
          owner: {type: String, required: true}
      }, {
          strict: 'throw',
          versionKey: false
          //,statics:{paginate: async function (filter,{docs,pagNum}){return await model('products').find(filter).skip((pagNum-1)*docs).limit(docs);}}
         }
  )

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(collection, productSchema);

export default productModel;