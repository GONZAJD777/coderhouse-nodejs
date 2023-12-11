import productModel from "../models/product.js";
import { NotFoundError, CustomError } from '../../../model/custom.error.js';

export default class ProductsManager {

    addProduct = async (body) => {
        try {
            const existProduct = await this.getProductByCode(body.code);
            if (existProduct) throw new CustomError(20021, `Error ya existe un producto con el codigo ${existProduct.code}`);

            return productModel.create(body);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20020, 'Error al agregar el producto');
        }
    }

    getProductById = async (id) => {
        try {
            const product = await productModel.findOne({ _id: id }).lean();
            if (!product) throw new NotFoundError(20011, 'Producto no encontrado');

            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20012, 'Error al obtener el producto');
        }
    }

    getProductByCode = async (code) => {
        try {
            return await productModel.findOne({ code: code }).lean();
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20013, 'Error al obtener el producto');
        }
    }

    getProducts = async (limit) => {
        try {
            if (limit){
                return await productModel.find().limit(limit).lean();
            }else {
                return await productModel.find().lean();
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20010, 'Error al obtener los productos');
        }
    }

    updateProduct = async (updateProduct) => {
        try {
            const product = await productModel.findByIdAndUpdate({ _id: updateProduct.id }, { $set: updateProduct }).lean();
            if (!product) throw new NotFoundError(20011, 'Producto no encontrado');

            return product;
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) throw error;
            throw new CustomError(20030, 'Error al actualizar el producto');
        }
    }

    deleteProduct = async (id) => {
        try {
            const product = await productModel.findByIdAndDelete({ _id: id }).lean();
            if (!product) throw new NotFoundError(20011, 'Producto no encontrado' + id);

            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20040, 'Error al eliminar el producto con ID: '+id);
        }
    }

}
