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
            const cart = await cartModel.findById({ _id: id }).lean();
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20112, 'Error al obtener el carrito de compra');
        }
    }

    getCarts = async () => {
        try {
            return await cartModel.find().lean();
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20110, 'Error al obtener el carrito de compra');
        }
    }

    updateCartAndProduct = async (idCard, idProduct, quantity=1, addProduct=true) => {
        try {
            const product = await this.productsManager.getProductById(idProduct);
            const cart = await this.getCartById(idCard);

            if (addProduct) {
                if (product.stock < quantity) {
                    throw new CustomError(10015, `Error solo quedan en stock ${product.stock} productos`);
                }
                product.stock -= quantity;
            } else {
                product.stock += quantity;
            }

            const detail = cart.detailCart.find(detailCart => detailCart._id==idProduct)||false;

            if (!detail || cart.detailCart.length === 0) {
                await cartModel.findOneAndUpdate({ _id: idCard }, { $push: {detailCart:{_id: idProduct,quantity: quantity}}});
            }
            else {
                const detailCart = detail;
                if (addProduct) {
                    detailCart.quantity += quantity;
                } else {
                    if (detailCart.quantity < units) {
                        throw new CustomError(10016, `Error solo puede quitar ${detailCart.quantity} productos del carrito de compras`);
                    }
                    detailCart.quantity -= quantity;
                }
                await cartModel.updateOne({ _id: cart._id, 'detailCart._id': detailCart._id }, {
                    $set: {
                        'detailCart.$.quantity': detailCart.quantity,
                    }
                });
            }

            await this.productsManager.updateProduct({ id: product._id, stock: product.stock });
            return await this.getCartById(idCard);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, ' Error al actualizar el carrito de compra');
        }
    }

    deleteCart = async (id) => {
        try {
            const cart = await cartModel.findByIdAndDelete({ _id: id }).lean();
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20140, 'Error al eliminar el carrito de compra');
        }
    }

}
