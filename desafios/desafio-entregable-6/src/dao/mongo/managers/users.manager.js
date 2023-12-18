import userModel from "../models/user.js";

export default class UserManager {
    get = async () => {
        return userModel.find().lean();
    }

    getBy = async (params) => {
        return userModel.findOne(params).lean();
    }

    create = async (body) => {
        return userModel.create(body);
    }
}