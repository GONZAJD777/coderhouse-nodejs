import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';

const DAOFactory = getPersistence();
const CartsDAO = DAOFactory.CartsDAO;
const ProductsDAO = DAOFactory.ProductsDAO
const UsersDAO = DAOFactory.UsersDAO
const TicketsDAO = DAOFactory.TicketsDAO

export default class TicketsManager {

    createTicket = async (cartId) => {
        try {
            let amount=0;
            let cart = await CartsDAO.readOne({_id:cartId});
            const user = await UsersDAO.readOne({cart:cartId});
            
            for (let index = cart.cartDetail.length-1 ; index >=0; index--) {
                const element = cart.cartDetail[index];
                let elementKeys=Object.keys(element);
                let elementValues=Object.values(element);
                console.log (elementKeys);
                console.log (elementValues);
                if (elementKeys[0]=="product" && elementKeys[1]=="quantity") {
                    const product = await ProductsDAO.readOne({_id : elementValues[0]});
                    if (!product){
                        throw new CustomError(10021, 'El el producto con id '+ Object.values(element[0]) +' no existe. | ' + error);
                    }else
                    {
                        if(product.stock >= cart.cartDetail[index].quantity){
                            amount = amount + cart.cartDetail[index].quantity * product.price;
                            product.stock -= cart.cartDetail[index].quantity;
                            cart.cartDetail.splice(index, 1); 
                            await ProductsDAO.updateOne({_id : elementValues[0]},{stock:product.stock});
                        } else{
                            console.log("no hay suficiente stock del producto "+ product.title +" para completar la compra");
                        }
                    }
                }else{
                    throw new CustomError(10022, 'Uno de los campos listados no se reconoce.'+ elementKeys +' |' + error);
                }
            }

            if (amount===0) throw new CustomError(10025, 'No hay stock suficiente para ninguno de los productos seleccionados, lo sentimos mucho! :(');

            const date = new Date();
            const param = {purchase_datetime:date,amount:amount,purchaser:user.email};
            const ticket = await TicketsDAO.create(param);
            if (!ticket) throw new CustomError(20021, 'No se pudo generar el ticket');

            if (cart.cartDetail.length>0){
                const info = "Los siguientes productos del carrito no pudieron completarse por falta de stock"
                cart = await CartsDAO.updateOne({_id:cartId},{cartDetail:cart.cartDetail});
                cart.cartDetail = await this.#populateCart(cart.cartDetail);
                return {ticket,message:info,cart};
            } else {
                cart = await CartsDAO.updateOne({_id:cartId},{cartDetail:cart.cartDetail});
                return ticket;
            }
            
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20020, 'Error al agregar el producto');
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