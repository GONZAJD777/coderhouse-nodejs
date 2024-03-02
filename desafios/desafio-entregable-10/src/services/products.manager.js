import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';
import { errorCodes,errorMessages } from "../dictionaries/errors.js";
import { logger } from "../config/logger.config.js";


const DAOFactory = getPersistence();
const ProductsDAO = DAOFactory.ProductsDAO

export default class ProductsManager {

    addProduct = async (object) => {
        try {
            const product = await ProductsDAO.readOne({code:object.code});
            if (product) throw new CustomError(errorCodes.ERROR_CREATE_PRODUCT_CODE_DUPLICATE, errorMessages[errorCodes.ERROR_CREATE_PRODUCT_CODE_DUPLICATE]+ ' | ' + object.code );

            return ProductsDAO.create(object);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_PRODUCT, errorMessages[errorCodes.ERROR_CREATE_PRODUCT]+ ' | ' + error );
        }
    }

    getProductById = async (idProduct) => {
        try {
            const product = await ProductsDAO.readOne({_id:idProduct});
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]);
            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_PRODUCT_WITH, errorMessages[errorCodes.ERROR_GET_PRODUCT_WITH]+ ' | ' + error );
        }
    }

    getProductByCode = async (code) => {
        try {
            const product = await ProductsDAO.readOne({code:code});
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]);
            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_PRODUCT_WITH, errorMessages[errorCodes.ERROR_GET_PRODUCT_WITH]+ ' | ' + error );
        }
    }

    
    getProducts = async (limit) => {
        try {
            let result = null;
            result = await ProductsDAO.readMany({});
            if (limit) result = result.slice(0,limit);
            
            return result;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_PRODUCT, errorMessages[errorCodes.ERROR_GET_PRODUCT]+ ' | ' + error );
        }
    }

    getProductsPaginate = async (caller,query) => {
        try {
            const options = {
                lean: true,
                page: query.page || 1,
                limit: query.limit || 5
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
                if (operator!="gt" && operator!="lt") filters.stock = Number(query.stock);
                
                filterQuery=filterQuery+"&stock="+query.stock;
            }

            if (query.category) {
                filters.category = query.category;
                filterQuery=filterQuery+"&category="+query.category;
            }

            const starIndex = (options.page-1)*options.limit;
            const endIndex = options.page*options.limit;
            let hasPrevPage;
            let hasNextPage;
            let prevPage;
            let nextPage;
            let totalPages;

            const resultQuery = await ProductsDAO.readMany(filters);
            const result =  resultQuery.slice(starIndex,endIndex);
            if (resultQuery.length === 0) throw new CustomError(errorCodes.ERROR_GET_PRODUCT, errorMessages[errorCodes.ERROR_GET_PRODUCT]);

            if (endIndex < resultQuery.length){
                hasNextPage=true;
                nextPage=Number(options.page)+1;
            } else {
                hasNextPage=false;
                nextPage=null;
            }

            if (starIndex>0){
                hasPrevPage=true;
                prevPage=Number(options.page)-1;
            }else {
                hasPrevPage=false;
                prevPage=null;
            }

            let prevLink=null;
            let nextLink=null;

            if (caller===1){
                prevLink = hasPrevPage ? prevPage : null;
                nextLink = hasNextPage ? nextPage : null;
            }else
            {
                prevLink = hasPrevPage ? '/api/products?page='+prevPage : null;
                nextLink = hasNextPage ? '/api/products?page='+nextPage : null;
            }
            
            prevLink = (options.sort && hasPrevPage)  ? prevLink+'&sort='+1 : prevLink;
            nextLink = (options.sort && hasNextPage) ? nextLink+'&sort='+1 : nextLink;
            
            prevLink = (options.limit && hasPrevPage) ? prevLink+'&limit='+options.limit : prevLink;
            nextLink = (options.limit && hasNextPage) ? nextLink+'&limit='+options.limit : nextLink;

            prevLink = hasPrevPage ? prevLink+filterQuery : prevLink;
            nextLink = hasNextPage ? nextLink+filterQuery : nextLink;

            totalPages =Math.ceil(resultQuery.length/options.limit);

            return {
                payload: result,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: options.page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_PRODUCT, errorMessages[errorCodes.ERROR_GET_PRODUCT]+ ' | ' + error );
        }
    }

    updateProduct = async (pid,updateProduct) => {
        try {
            const existProduct = await ProductsDAO.readOne({code:updateProduct.code});
            if (!existProduct && existProduct._id != pid) throw new CustomError(errorCodes.ERROR_CREATE_PRODUCT_CODE_DUPLICATE, errorMessages[errorCodes.ERROR_CREATE_PRODUCT_CODE_DUPLICATE]+ ' | ' + updateProduct.code );
            
            const product = await ProductsDAO.updateOne({_id:pid}, { ...updateProduct });
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]);
            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_PRODUCT, errorMessages[errorCodes.ERROR_UPDATE_PRODUCT]+ ' | ' + error );
        }
    }

    deleteProduct = async (id) => {
        try {
            const product = await ProductsDAO.readOne({_id:id});
            if (!product) throw new NotFoundError(errorCodes.ERROR_GET_PRODUCT_NOT_FOUND, errorMessages[errorCodes.ERROR_GET_PRODUCT_NOT_FOUND]);
            await ProductsDAO.deleteOne({_id:id});
            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_DELETE_PRODUCT, errorMessages[errorCodes.ERROR_DELETE_PRODUCT]+ ' | ' + error );
        }
    }

}
