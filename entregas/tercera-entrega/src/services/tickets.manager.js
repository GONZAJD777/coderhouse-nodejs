import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';

const CartsDAO = getPersistence.CartsDAO;
const ProductsDAO = getPersistence.ProductsDAO
const UsersDAO = getPersistence.UsersDAO
const TicketsDAO = getPersistence.TicketsDAO

export default class TicketsManager {

    createTicket = async (cartId) => {
        try {
            let amount;
            const cart = await CartsDAO.readOne({_id:cartId});
            const user = await UsersDAO.readOne({cart:cartId});
            
            for (let index = 0; index < cart.cartDetail.length; index++) {
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
                        if(product.quantity >= cart.cartDetail[index].quantity){
                            amount = amount + cart.cartDetail[index].quantity * product.price;
                            cart.cartDetail.splice(index, 1); 
                            product.stock -= cart.cartDetail[index].quantity;
                            await ProductsDAO.updateOne({_id : elementValues[0]},{product});
                        } else{
                            console.log("no hay suficiente stock del producto "+ product.title +" para completar la compra");
                        }
                    }
                }else{
                    throw new CustomError(10022, 'Uno de los campos listados no se reconoce.'+ elementKeys +' |' + error);
                }
            }

            const date = new Date();
            const param = {purchase_datetime:date,amount:amount,purchaser:user.email};
            const ticket = await TicketsDAO.create(param);
            if (!ticket) throw new CustomError(20021, 'No se pudo generar el ticket');

            if (cart.cartDetail.length>0){
                const info = "Los siguientes productos del carrito no pudieron completarse por falta de stock"
                return {ticket,message:info,cart};
            } else {
                return ticket;
            }
            
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20020, 'Error al agregar el producto');
        }
    }

   
}