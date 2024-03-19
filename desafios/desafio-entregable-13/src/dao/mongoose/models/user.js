import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema(
      {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        age:  {type: Number, required: true},
        password: {type: String, required: true},
        role: {type: String, enum: ['user', 'admin','premium'], default: 'user'},
        cart: {type: String, default: null}
      }, {
          strict: 'throw',
          versionKey: false
          //,statics:{paginate: async function (filter,{docs,pagNum}){return await model('products').find(filter).skip((pagNum-1)*docs).limit(docs);}}
         }
  )

const userModel = mongoose.model(collection, userSchema);
export default userModel;


