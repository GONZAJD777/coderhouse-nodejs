import mongoose from "mongoose";
import { randomUUID } from 'node:crypto'

const collection = "tickets";

const ticketSchema = new mongoose.Schema(
      {
        code: {type: String, required: true,unique: true,default:randomUUID()},
        purchase_datetime: {type: String, required: true, unique: true},
        amount:  {type: Number, required: true},
        purchaser: {type: String, required: true}
      }, {
          strict: 'throw',
          versionKey: false
          //,statics:{paginate: async function (filter,{docs,pagNum}){return await model('products').find(filter).skip((pagNum-1)*docs).limit(docs);}}
         }
  )

const ticketModel = mongoose.model(collection, ticketSchema);
export default ticketModel;