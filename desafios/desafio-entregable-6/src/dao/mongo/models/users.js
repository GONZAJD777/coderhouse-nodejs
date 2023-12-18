import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema(
      {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: [String], default:[]},
        age:  {type: Boolean, default: true},
        password: {type: String, required: true},
        role: {type: String, enum: ['user', 'admin'], default: 'user'}
      }, {
          strict: 'throw',
          versionKey: false
          //,statics:{paginate: async function (filter,{docs,pagNum}){return await model('products').find(filter).skip((pagNum-1)*docs).limit(docs);}}
         }
  )

const userModel = mongoose.model(collection, schema);
export default userModel;


