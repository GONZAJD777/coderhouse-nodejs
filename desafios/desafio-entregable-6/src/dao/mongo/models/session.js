import mongoose from "mongoose";

const collection = "sessions";

const sessionSchema = new mongoose.Schema(
      {
        sEmail: {type: String, required: true},
        //sPassword: {type: String, required: true},
        sExpireDate: {type: Date, required: true}
      }, {
         timestamps: true,
          strict: 'throw',
          versionKey: false
         }
  )

const sessionModel = mongoose.model(collection, sessionSchema);
export default sessionModel;