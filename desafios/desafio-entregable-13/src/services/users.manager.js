import CartsManager from "./carts.manager.js";
import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { logger } from "../config/logger.config.js";
import fs from "fs";


const DAOFactory = getPersistence();
const UsersDAO = DAOFactory.UsersDAO;
const CartManager = new CartsManager();

export default class UserManager {
    
    get = async () => {
        try {
            return UsersDAO.readMany();
        } catch (error){
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + error );
        }
    }

    getBy = async (params) => {
        try {
           if (params.email) {params.email= params.email.toLowerCase()}
           const user = await UsersDAO.readOne(params);
           return user;
        } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + error );
        }
    }

    create = async (body) => {
        try {
            body.email= body.email.toLowerCase()
            let user = await UsersDAO.readOne({email:body.email});//revisar DAO de usuarios para recibir email:email
            if(user) throw new CustomError(errorCodes.ERROR_CREATE_USER_EMAIL_DUPLICATE, errorMessages[errorCodes.ERROR_CREATE_USER_EMAIL_DUPLICATE]+ ' | ' + body.email );

            user = await UsersDAO.create(body);
            
            const cart = await CartManager.addCart();
            user.cart = cart._id;
            await UsersDAO.updateOne({email:body.email},{cart:cart._id})
            return user
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }   
    }

    update = async (filter,data) => {
        try {
            //data.email= data.email.toLowerCase();
            let user = await UsersDAO.readOne(filter);//revisar DAO de usuarios para recibir email:email
            if(!user) throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + body.email );
            
            user = await UsersDAO.updateOne(filter,{...data})
            return user
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }   
    }

    updateDoc = async (filter,{avatar,userIdDoc,userAddressDoc,userAccountDoc}) => {
        try {
            let documents=[];
            let oldDocuments=[];

            if(avatar) {documents.push({name:avatar[0].fieldname,reference:avatar[0].path})}
            if(userIdDoc) {documents.push({name:userIdDoc[0].fieldname,reference:userIdDoc[0].path})}
            if(userAddressDoc) {documents.push({name:userAddressDoc[0].fieldname,reference:userAddressDoc[0].path})}
            if(userAccountDoc) {documents.push({name:userAccountDoc[0].fieldname,reference:userAccountDoc[0].path})}        


            //data.email= data.email.toLowerCase();
            let user = await UsersDAO.readOne(filter);//revisar DAO de usuarios para recibir email:email
            if(!user) throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + body.email );

            if(!user.documents){ 
                user.documents=documents;
            } else {
                documents.forEach(element => {
                    const indexDocumentItem = user.documents.findIndex(document => document.name === element.name); 
                    if(indexDocumentItem === -1) { 
                        user.documents.push(element)
                    } else {
                        oldDocuments.push(user.documents[indexDocumentItem]);
                        user.documents[indexDocumentItem]=element;
                    }
                })
            }


            user = await UsersDAO.updateOne(filter,{documents:user.documents})
            oldDocuments.forEach(element => {fs.rmSync(element.reference)})
            return user
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }   
    }

    updateRole = async (filter) => {
        try {
            let user = await UsersDAO.readOne(filter);//revisar DAO de usuarios para recibir email:email
            if(!user) throw new CustomError(errorCodes.ERROR_GET_USER_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_USER_NOT_FOUND]+ ' | ' + filter ); 
            switch (user.role) {
                case 'user': user = await UsersDAO.updateOne(filter,{role:'premium'})
                  break;
                case 'premium': user = await UsersDAO.updateOne(filter,{role:'user'})
                  break;
            }
            return user
            } catch (error){  
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }   
    }

    deleteAll = async (params) => {
        try {
            const result = await UsersDAO.deleteMany(params);
            return result;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }
    }

    deleteOne = async (params) => {
        try {
            const result = await UsersDAO.deleteOne(params);
            return result;
        }
        catch (error)
        {  if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]+ ' | ' + error );
        }
    }

}