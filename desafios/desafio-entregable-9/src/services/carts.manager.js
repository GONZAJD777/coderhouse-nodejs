import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';
import { errorCodes,errorMessages } from "../dictionaries/errors.js";

const DAOFactory = getPersistence();
const CartsDAO = DAOFactory.CartsDAO;
const ProductsDAO = DAOFactory.ProductsDAO;


export default class CartsManager {   

    addCart = async () => {
        try {
            return await CartsDAO.create({});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_CART, errorMessages[errorCodes.ERROR_CREATE_CART] + ' | ' + error);
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await CartsDAO.readOne({_id:id});
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_WITH, errorMessages[errorCodes.ERROR_GET_CART_WITH]); 
            cart.cartDetail =await this.#populateCart(cart.cartDetail)
            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_CART, errorMessages[errorCodes.ERROR_GET_CART] + ' | ' + error);
        }
    }

    getCarts = async () => {
        try {
            return await CartsDAO.readMany();
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_CART, errorMessages[errorCodes.ERROR_GET_CART] + ' | ' + error);
        }
    }

    updateCartAndProduct = async (idCart, idProduct, quantity, addProduct) => {
        try {
            const product = await ProductsDAO.readOne({_id:idProduct});
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_WITH, errorMessages[errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]);
            const cart = await CartsDAO.readOne({_id:idCart});
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_WITH, errorMessages[errorCodes.ERROR_GET_CART_WITH]); 

            const indexCartDetailItem = cart.cartDetail.findIndex(cartDetail => cartDetail.product === idProduct);  

            if (addProduct) {
                if (product.stock < quantity) {
                    throw new CustomError(errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT] + ' | '+ product.title);
                }
            }

            if (indexCartDetailItem === -1) {
                cart.cartDetail.push({product: idProduct,quantity: quantity})
                await CartsDAO.updateOne({ _id:idCart },{cartDetail:cart.cartDetail});
            }
            else {
                if (addProduct) {
                    cart.cartDetail[indexCartDetailItem].quantity += quantity;
                } else {
                    if (cartDetailItem.quantity < quantity) {
                        throw new CustomError(errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT] + ' | '+ product.title);
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
            throw new CustomError(errorCodes.ERROR_UPDATE_CART, errorMessages[errorCodes.ERROR_UPDATE_CART] + ' | ' + error);

        }
    }


    updateCartProductQuantity = async (idCart, idProduct, quantity) => {
        try {
            const product = await ProductsDAO.readOne({_id:idProduct});
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_WITH, errorMessages[errorCodes.ERROR_GET_PRODUCT_WITH]);
            const cart = await CartsDAO.readOne({_id:idCart});
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_WITH, errorMessages[errorCodes.ERROR_GET_CART_WITH]);             

            if (product.stock < quantity) throw new CustomError(errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT] + ' | '+ product.title);
            if (quantity <= 0) throw new CustomError(errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT] + ' | '+ product.title);


            const indexCartDetailItem = cart.cartDetail.findIndex(cartDetail => cartDetail.product === idProduct);  
            if (indexCartDetailItem === -1) throw new NotFoundError(errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT] + ' | '+ product.title);                   

            cart.cartDetail[indexCartDetailItem].quantity = quantity;
            await CartsDAO.updateOne({ _id:idCart },{ cartDetail:cart.cartDetail });           

            return await CartsDAO.readOne({_id:idCart});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_CART, errorMessages[errorCodes.ERROR_UPDATE_CART] + ' | ' + error);
        }
    }


    updateCartProducts = async (idCart, cartDetail) => {
        try {

            let cart = await CartsDAO.readOne({_id:idCart});
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_WITH, errorMessages[errorCodes.ERROR_GET_CART_WITH]);

            let AddProducts=[];
            for (let index = 0; index < cartDetail.length; index++) {
                const element = cartDetail[index];
                let elementKeys=Object.keys(element);
                let elementValues=Object.values(element);
                console.log (elementKeys);
                console.log (elementValues);
                if (!elementKeys[0]=="product" && !elementKeys[1]=="quantity")  throw new NotFoundError(errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT]);
                    const product = await ProductsDAO.readOne({_id:elementValues[0]});
                if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_WITH, errorMessages[errorCodes.ERROR_GET_PRODUCT_WITH] + ' | ' + elementValues[0]);
                    AddProducts.push(elementValues);   
            }

            //luego de las validaciones, verificamos si hay productos para agregar, si es asi limpiamos el carrito
            if(AddProducts.length===0)throw new CustomError(10022, 'No hay productos para agregar al carrito.');
            await this.deleteCart(idCart); //vaciamos el carrito

            //luego de limpiar el carrito si tenia items, agrego los productos al carrito con la cantidad especificada
            console.log (AddProducts);
            for (let index = 0; index < AddProducts.length; index++) {
                const element = AddProducts[index];
                await this.updateCartAndProduct(idCart,element[0],element[1],true); 
            }

            cart = await CartsDAO.readOne({_id:idCart});
            cart.cartDetail = await this.#populateCart(cart.cartDetail)
            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_CART, errorMessages[errorCodes.ERROR_UPDATE_CART] + ' | ' + error);
        }
    }

    
    deleteProductFromCart = async (idCart,idProduct) => {
        try {
            const product = await ProductsDAO.readOne({_id:idProduct});
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_WITH, errorMessages[errorCodes.ERROR_GET_PRODUCT_WITH]);
            const cart = await CartsDAO.readOne({_id:idCart});
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_WITH, errorMessages[errorCodes.ERROR_GET_CART_WITH]); 

            const indexCartDetailItem = cart.cartDetail.findIndex(cartDetail => cartDetail.product === idProduct);  
            if (indexCartDetailItem === -1) throw new NotFoundError(errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_CART_WITH_PRODUCT] + ' | '+ product.title);                         

            cart.cartDetail.splice(indexCartDetailItem, 1) 
            await CartsDAO.updateOne({ _id: idCart },{cartDetail:cart.cartDetail});

            return await CartsDAO.readOne({_id:idCart});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_CART, errorMessages[errorCodes.ERROR_UPDATE_CART] + ' | ' + error);
        }
    }

    deleteCart = async (idCart) => { //los carritos no se eliminan, solo se vacian
        try {
            const cart = await CartsDAO.readOne({_id:idCart});
            if (!cart) throw new NotFoundError(errorCodes.ERROR_GET_CART_WITH, errorMessages[errorCodes.ERROR_GET_CART_WITH]);

            const cartEmptied = await CartsDAO.updateOne({ _id: idCart}, {cartDetail: []});

            return cartEmptied;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_CART, errorMessages[errorCodes.ERROR_UPDATE_CART] + ' | ' + error);
        }
    }

    deleteAllCart = async (params) => { //los carritos no se eliminan, solo se vacian
        try {
            const result = await CartsDAO.deleteMany(params)
            return result;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_CART, errorMessages[errorCodes.ERROR_UPDATE_CART] + ' | ' + error);
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
