import mongoose from "mongoose";

const collection = "messages";

const messageSchema = new mongoose.Schema({
    user: {type: String, required: true},
    message: {type: String, required: true}
}, {
    strict: 'throw',
    versionKey: false
  }
);






const messageModel = mongoose.model(collection, messageSchema);

export default messageModel;