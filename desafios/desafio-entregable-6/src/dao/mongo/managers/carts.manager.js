import cartModel from "../models/cart.js";
import ProductsManager from "./products.manager.js";
import { NotFoundError, CustomError } from '../../../model/custom.error.js';

export default class CartsManager {
    productsManager;

    constructor() {
        this.productsManager = new ProductsManager();
    }

    addCart = async () => {
        try {
            return await cartModel.create({});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20101, 'Error al crear el carrito de compra');
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await cartModel.find({ _id: id }).populate('cartDetail.product').lean();
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20112,'Error al obtener el carrito de compra | '+error);
        }
    }

    getCarts = async () => {
        try {
            return await cartModel.find().populate('cartDetail.product').lean();
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20110, 'Error al obtener el carrito de compra');
        }
    }

    


    updateCartAndProduct = async (idCart, idProduct, quantity, addProduct) => {
        try {
            const product = await this.productsManager.getProductById(idProduct);
            const cart = await this.getCartById(idCart);

            if (addProduct) {
                if (product.stock < quantity) {
                    throw new CustomError(10015, 'Error solo quedan en stock ' +product.stock +' productos | ' + error);
                }
                product.stock -= quantity;
            } else {
                product.stock += quantity;
            }

            const detail = cart[0].cartDetail.find(cartDetail => cartDetail.product._id==idProduct)||false;

            if (!detail || cart[0].length === 0) {
                await cartModel.findOneAndUpdate({ _id: idCart }, { $push: {cartDetail:{product: idProduct,quantity: quantity}}});
            }
            else {
                const cartDetail = detail;
                if (addProduct) {
                    cartDetail.quantity += quantity;
                } else {
                    if (cartDetail.quantity < quantity) {
                        throw new CustomError(10016, 'Error solo puede quitar '+ detailCart.quantity + 'productos del carrito de compras | ' + error);
                    }
                    cartDetail.quantity -= quantity;
                }

                if (cartDetail.quantity===0)
                {
                    //si el remanente es 0 se elimina el objeto
                    await cartModel.findOneAndUpdate({ _id: idCart }, { $pull: {cartDetail:{product: idProduct,quantity: quantity}}});
                }
                else {
                    await cartModel.updateOne({ idProduct: cart[0].cartDetail.idProduct, 'cartDetail.product': cartDetail.product}, 
                    {$set: {'cartDetail.$.quantity': cartDetail.quantity}});
                }
              
            }

            await this.productsManager.updateProduct({ id: product._id, stock: product.stock });
            return await this.getCartById(idCart);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra | ' + error);
        }
    }


    updateCartProductQuantity = async (idCart, idProduct, quantity) => {
        try {
            const product = await this.productsManager.getProductById(idProduct);
            const cart = await this.getCartById(idCart);

            if (product.stock < quantity) throw new CustomError(10015, 'Error solo quedan en stock ' +product.stock +' productos | ' + error);
            if (quantity <= 0) throw new CustomError(10017, 'Error el valor debe ser mayor a 0, no se puede setear unidades negativas al carrito');
            const detail = cart[0].cartDetail.find(cartDetail => cartDetail.product._id==idProduct)||false;
            if (!detail || cart[0].length === 0) throw new CustomError(10017, 'El producto no se encuentra en el carrito');       
            const cartDetail = detail;
            product.stock += cartDetail.quantity - quantity;
            cartDetail.quantity = quantity;

            await cartModel.updateOne({ idProduct: cart[0].cartDetail.idProduct, 'cartDetail.product': cartDetail.product},
            {$set: {'cartDetail.$.quantity': cartDetail.quantity}});                      
            await this.productsManager.updateProduct({ id: product._id, stock: product.stock });

            return await this.getCartById(idCart);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra | ' + error);
        }
    }


    updateCartProducts = async (idCart, cartDetail) => {
        try {

            const cart = await this.getCartById(idCart)||false;
            if (!cart)throw new CustomError(10020, 'El carrito no existe. | ' + error);
            let AddProducts=[];
            for (let index = 0; index < cartDetail.length; index++) {
                const element = cartDetail[index];
                let elementKeys=Object.keys(element);
                let elementValues=Object.values(element);
                console.log (elementKeys);
                console.log (elementValues);
                if (elementKeys[0]=="product" && elementKeys[1]=="quantity") {
                    const product = await this.productsManager.getProductById(elementValues[0])||false;
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
            

            return await this.getCartById(idCart);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra | ' + error);
        }
    }

    
    deleteProductFromCart = async (idCart,idProduct) => {
        try {
            const product = await this.productsManager.getProductById(idProduct);
            const cart = await this.getCartById(idCart);

            const detail = cart[0].cartDetail.find(cartDetail => cartDetail.product._id==idProduct)||false;
            if (!detail || cart[0].length === 0) throw new CustomError(10017, 'El producto no se encuentra en el carrito');       
            const cartDetail = detail;
            product.stock += cartDetail.quantity;
        
            await cartModel.findOneAndUpdate({ _id: idCart }, { $pull: {cartDetail:{product: idProduct,quantity: cartDetail.quantity}}});
            await this.productsManager.updateProduct({ id: product._id, stock: product.stock });

            return await this.getCartById(idCart);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra | ' + error);
        }
    }

    deleteCart = async (idCart) => {
        try {
            const cart = await this.getCartById(idCart)||false;       
            
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            const cartEmptied = await cartModel.findByIdAndUpdate({ _id: idCart}, {$set: {'cartDetail': [],}});

            if (!cartEmptied) throw new NotFoundError(20111, 'Carrito de compra no encontrado |' + error);

            for (let index = 0; index < cart[0].cartDetail.length; index++) {
                const element = cart[0].cartDetail[index];
                let product  = element.product._id;
                let productStock= element.product.stock +element.quantity;       

                await this.productsManager.updateProduct({ id: product, stock: productStock });
            }

            return cartEmptied;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20140, 'Error al eliminar el carrito de compra');
        }
    }

}
