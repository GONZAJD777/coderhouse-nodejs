import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';


const DAOFactory = getPersistence();
const CartsDAO = DAOFactory.CartsDAO;
const ProductsDAO = DAOFactory.ProductsDAO;


export default class CartsManager {   

    addCart = async () => {
        try {
            return await CartsDAO.create({});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20101, 'Error al crear el carrito de compra');
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await CartsDAO.readOne({ _id: id });
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');
            cart.cartDetail =await this.populateCart(cart.cartDetail)
            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20112,'Error al obtener el carrito de compra | '+error);
        }
    }

    getCarts = async () => {
        try {
            return await CartsDAO.readMany();
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20110, 'Error al obtener el carrito de compra');
        }
    }

    populateCart = async (object) =>{

        for (let index = 0; index < object.length; index++) {
          const product = await ProductsDAO.readOne({_id:object[index].product});
          object[index].product = product;
        }
      return object
      }

    updateCartAndProduct = async (idCart, idProduct, quantity, addProduct) => {
        try {
            const product = await ProductsDAO.readOne({_id:idProduct});
            if (!product) throw new CustomError(10015, 'El ID de producto no existe');
            const cart = await CartsDAO.readOne({_id:idCart});
            if (!cart) throw new CustomError(10015, 'El carrito no existe');
            const indexCartDetailItem = cart.cartDetail.findIndex(cartDetail => cartDetail.product === idProduct);  

            if (addProduct) {
                if (product.stock < quantity) {
                    throw new CustomError(10015, 'Error solo quedan en stock ' +product.stock +' productos | ' + error);
                }
            }

            if (indexCartDetailItem === -1) {
                const cartDetail = cart.cartDetail.push({product: idProduct,quantity: quantity})
                await CartsDAO.updateOne({ _id:idCart },{cartDetail:cart.cartDetail});
            }
            else {
                if (addProduct) {
                    cart.cartDetail[indexCartDetailItem].quantity += quantity;
                } else {
                    if (cartDetailItem.quantity < quantity) {
                        throw new CustomError(10016, 'Error solo puede quitar '+ cartDetail.quantity + 'productos del carrito de compras | ' + error);
                    }
                    cart.cartDetail[indexCartDetailItem].quantity -= quantity;
                }
                if (cart.cartDetail[indexCartDetailItem].quantity===0)
                {
                    //si el remanente es 0 se elimina el objeto
                    const cartDetail=cart.cartDetail.splice(indexCartDetailItem, 1) 
                    await CartsDAO.updateOne({ _id: idCart },{cartDetail:cartDetail});
                }
                else {
                    await CartsDAO.updateOne({ _id: idCart },{cartDetail:cart.cartDetail});
                }
            }

            return await CartsDAO.readOne({_id:idCart});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra | ' + error);
        }
    }


    updateCartProductQuantity = async (idCart, idProduct, quantity) => {
        try {
            const product = await ProductsDAO.readOne({_id : idProduct});
            const cart = await CartsDAO.readOne({_id : idCart});

            if (product.stock < quantity) throw new CustomError(10015, 'Error solo quedan en stock ' +product.stock +' productos | ' + error);
            if (quantity <= 0) throw new CustomError(10017, 'Error el valor debe ser mayor a 0, no se puede setear unidades negativas al carrito');

            const indexCartDetailItem = cart.cartDetail.findIndex(cartDetail => cartDetail.product === idProduct);  
            if (indexCartDetailItem === -1) throw new CustomError(10017, 'El producto no se encuentra en el carrito');                   

            cart.cartDetail[indexCartDetailItem].quantity = quantity;
            await CartsDAO.updateOne({ _id:idCart },{ cartDetail:cart.cartDetail });           

            return await CartsDAO.readOne({_id:idCart});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra | ' + error);
        }
    }


    updateCartProducts = async (idCart, cartDetail) => {
        try {

            const cart = await CartsDAO.readOne({_id:idCart});
            if (!cart)throw new CustomError(10020, 'El carrito no existe. | ' + error);
            let AddProducts=[];
            for (let index = 0; index < cartDetail.length; index++) {
                const element = cartDetail[index];
                let elementKeys=Object.keys(element);
                let elementValues=Object.values(element);
                console.log (elementKeys);
                console.log (elementValues);
                if (elementKeys[0]=="product" && elementKeys[1]=="quantity") {
                    const product = await ProductsDAO.readOne({_id : elementValues[0]})||false;;
                    if (!product){
                        if (!cart)throw new CustomError(10021, 'El el producto con id '+ Object.values(element[0]) +' no existe. | ' + error);
                    }else
                    {
                        AddProducts.push(elementValues)   
                    }
                }else{
                    throw new CustomError(10022, 'Uno de los campos listados no se reconoce.'+ elementKeys +' |' + error);
                }
            }
            //luego de las validaciones, verificamos si hay productos para agregar, si es asi limpiamos el carrito
            if(AddProducts.length>0){await this.deleteCart(idCart);}
            else {throw new CustomError(10022, 'No hay productos para agregar al carrito.');}
        
            //luego de limpiar el carrito si tenia items, agrego los productos al carrito con la cantidad especificada
            console.log (AddProducts);
            for (let index = 0; index < AddProducts.length; index++) {
                const element = AddProducts[index];
                await this.updateCartAndProduct(idCart,element[0],element[1],true); 
            }
            return await CartsDAO.readOne({_id : idCart});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra | ' + error);
        }
    }

    
    deleteProductFromCart = async (idCart,idProduct) => {
        try {
            const product = await ProductsDAO.readOne({_id:idProduct});
            if (!product) throw new CustomError(10015, 'El ID de producto no existe');
            const cart = await CartsDAO.readOne({_id:idCart});
            if (!cart) throw new CustomError(10015, 'El carrito no existe');

            const indexCartDetailItem = cart.cartDetail.findIndex(cartDetail => cartDetail.product === idProduct);  
            if (indexCartDetailItem === -1) throw new CustomError(10017, 'El producto no se encuentra en el carrito');                          

            const cartDetail=cart.cartDetail.splice(indexCartDetailItem, 1) 
            await CartsDAO.updateOne({ _id: idCart },{cartDetail:cartDetail});

            return await CartsDAO.readOne({_id:idCart});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra | ' + error);
        }
    }

    deleteCart = async (idCart) => { //los carritos no se eliminan, solo se vacian
        try {
            const cart = await CartsDAO.readOne({_id:idCart})||false;       
            
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            const cartEmptied = await CartsDAO.updateOne({ _id: idCart}, {cartDetail: []});

            return await CartsDAO.readOne({_id:idCart});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20140, 'Error al eliminar el carrito de compra');
        }
    }

}
