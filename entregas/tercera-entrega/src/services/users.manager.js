import CartsManager from "./carts.manager.js";
import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';

const DAOFactory = getPersistence();
const UsersDAO = DAOFactory.UsersDAO;
const CartManager = new CartsManager();

export default class UserManager {
    get = async () => {
        return UsersDAO.readMany();
    }

    getBy = async (params) => {
        try {
           const user = await UsersDAO.readOne(params);
           return user;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(20032, 'Error al buscar el usuario'); }
    }

    create = async (body) => {
        try {
        let user = await UsersDAO.readOne({email:body.email});//revisar DAO de usuarios para recibir email:email
        if(user) throw new CustomError(20033, 'El email ya esta siendo utilizado por otro usuario');   
        user = await UsersDAO.create(body);
        
        const cart = await CartManager.addCart();
        user.cart = cart._id;
        await UsersDAO.updateOne({email:body.email},{cart:cart._id})
        return user
            }
         catch (error)
         {  if (error instanceof CustomError) throw error;
             throw new CustomError(20034, 'Error al crear el usuario. | '+ error); 
            }
        
    }

    deleteAll = async (params) => {
        try {
            const result = await UsersDAO.deleteMany(params);
            return result;
         }
         catch (error)
         {  if (error instanceof CustomError) throw error;
             throw new CustomError(20032, 'Error al eliminar los Usuarios'); }
    }
    
}