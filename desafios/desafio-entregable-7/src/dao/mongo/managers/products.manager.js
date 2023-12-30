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

    getProductsPaginate = async (caller,query) => {
        try {
            const options = {
                lean: true,
                page: query.page || 1,
                limit: query.limit || 10
            };

            if (query.sort) {
                options.sort= {price: Number(query.sort) };
            }
            
            let filters = {};
            let filterQuery="";

            if (query.title) {
                filters.title = query.title;
                filterQuery=filterQuery+"&title="+query.title;
            }

            if (query.description) {
                filters.description = query.description;
                filterQuery=filterQuery+"&description="+query.description;
            }

            if (query.code) {
                filters.code = query.code;
                filterQuery=filterQuery+"&code="+query.code;
            }

            if (query.stock) {
                
                const operator=query.stock.substring(0,2);
                const value=Number(query.stock.substring(2));
               
                if (operator==="gt") filters.stock = {$gte: value};
                if (operator==="lt") filters.stock = {$lte: value};
                if (operator!="gt" && operator!="lt") filters.stock = query.stock;
                
                filterQuery=filterQuery+"&stock="+query.stock;
            }

            if (query.category) {
                filters.category = query.category;
                filterQuery=filterQuery+"&category="+query.category;
            }

            const result = await productModel.paginate(filters, options);
            if (result.totalDocs === 0) throw new NotFoundError(20011, 'No se encontraron productos que coincidan con los criterios de búsqueda.');


            const hasPrevPage = result.hasPrevPage;
            const hasNextPage = result.hasNextPage;

            let prevLink=null;
            let nextLink=null;

            if (caller===1){
                prevLink = hasPrevPage ? result.prevPage : null;
                nextLink = hasNextPage ? result.nextPage : null;
            }else
            {
                prevLink = hasPrevPage ? '/api/products?page='+result.prevPage : null;
                nextLink = hasNextPage ? '/api/products?page='+result.nextPage : null;
            }
            
            prevLink = (options.sort && hasPrevPage)  ? prevLink+'&sort='+1 : prevLink;
            nextLink = (options.sort && hasNextPage) ? nextLink+'&sort='+1 : nextLink;
            
            prevLink = (options.limit && hasPrevPage) ? prevLink+'&limit='+options.limit : prevLink;
            nextLink = (options.limit && hasNextPage) ? nextLink+'&limit='+options.limit : nextLink;

            prevLink = hasPrevPage ? prevLink+filterQuery : prevLink;
            nextLink = hasNextPage ? nextLink+filterQuery : nextLink;

            return {
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            }
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) throw error;
            throw new CustomError(20010, 'Error al obtener los productos' + error);
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
