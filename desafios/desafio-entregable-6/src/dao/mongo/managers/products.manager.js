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
            if (!product) throw new NotFoundError(20011, 'Producto ' + id +' no encontrado');

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
            let result=null;
            //const filter= {category:"ABC"};
            

            //result = await productModel.paginate(filter,{limit:5,page:2});
            result= await productModel.find().lean();
            
            if (limit){
                //return await productModel.find().limit(limit).lean();
                result=result.slice(0,limit);
            }

           return result;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20010, 'Error al obtener los productos |' + error);
        }
    }

    getProductsPaginate = async (query) => {
        try {
            const options = {
                lean: true,
                page: query.page || 1,
                limit: query.limit || 6
            };

            if (query.sort) {
                options.sort = { ['price']: query.sort };
            }

            let filters = {};

            if (query.title) {
                filters.title = query.title;
            }

            if (query.description) {
                filters.description = query.description;
            }

            if (query.code) {
                filters.code = query.code;
            }

            if (query.price) {
                filters.price = query.price;
            }

            if (query.category) {
                filters.category = query.category;
            }

            const result = await productModel.paginate(filters, options);
            if (result.totalDocs === 0)
                throw new NotFoundError(20011, 'No se encontraron productos que coincidan con los criterios de búsqueda.');


            const hasPrevPage = result.hasPrevPage;
            const hasNextPage = result.hasNextPage;

            const prevLink = hasPrevPage ? `/products?page=${result.prevPage}` : null;
            const nextLink = hasNextPage ? `/products?page=${result.nextPage}` : null;

            return {
                status: result.status,
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            }
        } catch (error) {
            console.log(error);
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
