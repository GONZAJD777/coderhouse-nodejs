import userModel from "../models/user.js";
import { CustomError,NotFoundError } from "../../../model/custom.error.js";

export default class UserManager {
    get = async () => {
        return userModel.find().lean();
    }

    getBy = async (params) => {
        try {
           const user = await userModel.find(params).select('-password').lean();
            if (user.length===0) throw new NotFoundError(20031, 'Usuario no encontrado');
            return user;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(20032, 'Error al buscar el usuario'); }
            
       
    }

    create = async (body,cartId) => {
        return userModel.create(body);
    }
}