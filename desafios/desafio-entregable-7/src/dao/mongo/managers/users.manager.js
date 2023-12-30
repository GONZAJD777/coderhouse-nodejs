import userModel from "../models/user.js";
import CartsManager from "./carts.manager.js";
import { CustomError,NotFoundError } from "../../../model/custom.error.js";

const cartManager = new CartsManager();

export default class UserManager {
    get = async () => {
        return userModel.find().lean();
    }

    getBy = async (params) => {
        try {
           const user = await userModel.find(params);
           
            return user;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(20032, 'Error al buscar el usuario'); }
            
       
    }

    create = async (body) => {
        try {
        const user = await userModel.create(body);
        if(!user) throw new CustomError(20033, 'El email ya esta siendo utilizado por otro usuario');
        const cartId = await cartManager.addCart();
        await userModel.findOneAndUpdate({email:body.email},{$set:{cart:cartId._id}})
        return user
            }
         catch (error)
         {  if (error instanceof CustomError) throw error;
             throw new CustomError(20034, 'Error al crear el usuario. | '+ error); 
            }
        
    }
}