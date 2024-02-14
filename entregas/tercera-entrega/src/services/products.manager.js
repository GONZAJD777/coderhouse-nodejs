import { getPersistence } from "../dao/dao.factory.js";
import { NotFoundError, CustomError } from '../errors/custom.error.js';

const DAOFactory = getPersistence();
const ProductsDAO = DAOFactory.ProductsDAO

export default class ProductsManager {

    addProduct = async (object) => {
        try {
            const existProduct = await ProductsDAO.readOne({code:object.code});
            if (existProduct) throw new CustomError(20021, `Error ya existe un producto con el codigo ${existProduct.code}`);
            return ProductsDAO.create(object);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20020, 'Error al agregar el producto');
        }
    }

    getProductById = async (id) => {
        try {
            const product = await ProductsDAO.readOne({_id:id});
            if (!product) throw new NotFoundError(20011, 'Producto ' + id +' no encontrado');
            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20012, 'Error al obtener el producto '+ error);
        }
    }

    getProductByCode = async (code) => {
        try {
            return await ProductsDAO.readOne({code:code});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20013, 'Error al obtener el producto');
        }
    }

    
    getProducts = async (limit) => {
        try {
            let result=null;
            result= await ProductsDAO.readMany({});
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
                if (operator!="gt" && operator!="lt") filters.stock = query.stock;
                
                filterQuery=filterQuery+"&stock="+query.stock;
            }

            if (query.category) {
                filters.category = query.category;
                filterQuery=filterQuery+"&category="+query.category;
            }

            //const result = await getProducts().paginate(filters, options);

            const starIndex = (options.page-1)*options.limit;
            const endIndex = options.page*options.limit;
            let hasPrevPage;
            let hasNextPage;
            let prevPage;
            let nextPage;
            let totalPages;

            const resultQuery = await ProductsDAO.readMany({});
            const result =  resultQuery.slice(starIndex,endIndex);
            if (resultQuery.length === 0) throw new NotFoundError(20011, 'No se encontraron productos que coincidan con los criterios de búsqueda.');


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
            console.log(error);
            if (error instanceof CustomError) throw error;
            throw new CustomError(20010, 'Error al obtener los productos' + error);
        }
    }

    updateProduct = async (pid,updateProduct) => {
        try {
            const existProduct = await ProductsDAO.readOne({code:updateProduct.code});
            if (existProduct && existProduct._id != pid) throw new CustomError(20021, 'Error ya existe un producto con el codigo ' + existProduct.code);

            const product = await ProductsDAO.updateOne({_id:pid}, { ...updateProduct });
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

            let product = await ProductsDAO.readOne({_id:id});
            if (!product) throw new NotFoundError(20011, 'Producto ' + id +' no encontrado');
            product = await ProductsDAO.deleteOne({_id:id});
            if (!product) throw new CustomError(20011, 'Error al borrar el producto'+ id);
            return product;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20040, 'Error al eliminar el producto con ID: '+id + '|' + error);
        }
    }

}
