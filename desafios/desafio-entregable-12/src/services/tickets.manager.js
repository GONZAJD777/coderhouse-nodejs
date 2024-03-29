import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { ADMIN_EMAIL, ADMIN_ID, ADMIN_FNAME, ADMIN_LNAME, ADMIN_ROLE, ADMIN_CART } from '../config/config.js';
import { logger } from "../config/logger.config.js";

const DAOFactory = getPersistence();
const CartsDAO = DAOFactory.CartsDAO;
const ProductsDAO = DAOFactory.ProductsDAO
const UsersDAO = DAOFactory.UsersDAO
const TicketsDAO = DAOFactory.TicketsDAO

export default class TicketsManager {

    createTicket = async (cartId) => {
        try {

            const admin = { _id:ADMIN_ID,
                            firstName:ADMIN_FNAME,
                            lastName: ADMIN_LNAME,
                            email:ADMIN_EMAIL,
                            role:ADMIN_ROLE,
                            cart:ADMIN_CART};

            let amount=0;
            let cart = await CartsDAO.readOne({_id:cartId});
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_WITH, errorMessages[errorCodes.ERROR_GET_CART_WITH]); 

            const user = await UsersDAO.readOne({cart:cartId}) || admin;
            
            for (let index = cart.cartDetail.length-1 ; index >=0; index--) {
                const element = cart.cartDetail[index];
                let elementKeys=Object.keys(element);
                let elementValues=Object.values(element);
                logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + elementKeys);
                logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + elementValues);
                
                const product = await ProductsDAO.readOne({_id:elementValues[0]});
                if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]);

                if(product.stock < cart.cartDetail[index].quantity){
                 logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + 
                            "no hay suficiente stock del producto "+ product.title +" para completar la compra");
                }else {   
                amount = amount + cart.cartDetail[index].quantity * product.price;
                product.stock -= cart.cartDetail[index].quantity;
                cart.cartDetail.splice(index, 1); 
                await ProductsDAO.updateOne({_id : elementValues[0]},{stock:product.stock});
                }
            }
            
            if (amount===0) throw new CustomError(errorCodes.ERROR_CREATE_TICKET, errorMessages[errorCodes.ERROR_CREATE_TICKET] + ' | ' 
                                                    + 'No hay suficiente stock de ningun producto, lo sentimos mucho');

            const date = new Date();
            const param = {purchase_datetime:date.toString().substring(0,24),amount:amount,purchaser:user.email};
            const ticket = await TicketsDAO.create(param);
            if (!ticket) throw new CustomError(errorCodes.ERROR_CREATE_TICKET, errorMessages[errorCodes.ERROR_CREATE_TICKET]);
            let info;
            if (cart.cartDetail.length>0){
                info="IMPORTANTE Los siguientes productos del carrito no pudieron completarse por falta de stock"
                cart = await CartsDAO.updateOne({_id:cartId},{cartDetail:cart.cartDetail});
                cart.cartDetail = await this.#populateCart(cart.cartDetail);
                logger.log('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + 
                            "IMPORTANTE : por falta de stock, el proceso de compra no pudo finalizarse para algunos articulos");
                
                return {ticket,message:info,cart};
            } else {
                info="";
                cart = await CartsDAO.updateOne({_id:cartId},{cartDetail:cart.cartDetail});
                return {ticket,message:info,cart};
            }
            
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_TICKET, errorMessages[errorCodes.ERROR_CREATE_TICKET] + ' | ' + error);
        }
    }

    #populateCart = async (object) =>{

        for (let index = 0; index < object.length; index++) {
          const product = await ProductsDAO.readOne({_id:object[index].product});
          object[index].product = product;
        }
      return object
      }

   
}