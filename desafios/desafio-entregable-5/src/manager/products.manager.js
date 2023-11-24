import Product from '../model/product.js';
import FileManager from './files.manager.js';
import { CustomError, NotFoundError } from '../model/custom.error.js';


class ProductsManager {
  fileManager;
  constructor() {
    this.fileManager = new FileManager('\\data\\products.json');
    this.getLatestIdProduct();   
    
  }

  getLatestIdProduct() {
    try {
      const products = this.getProducts();
      if (products.length !== 0) Product.id = products.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
      else Product.id = 0;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(500010, 'Error al guardar datos en el archivo');
    }
  }

  getProducts(query) {
    try {
      let result = this.fileManager.getDataFromFile();
      //let result = this.getProductsFromFile();

      if (query===undefined){
        return result;
      } else {    
        //let b = Number(limit);
        return result.slice(0,query);
      }
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(500020, 'Error al obtener los productos');
    }
  }

  async getProductById(id) {
    try{
      const find = (await this.getProducts().find(product => product.id === id )||false)
      if (find){
        return find
      } else { 
        throw new NotFoundError(500031, 'El codigo ingresado '+ id + ' no corresponde a un producto.');
      }
    }   
    catch(error){
      if (error instanceof CustomError) throw error;
      throw new CustomError(500032, 'Error al obtener los productos');
    }    
  }
  
  async getProductByCode(code,id) {
   
   try{
        const findByCode = (await this.getProducts().find(product => product.code === code)||false);
        if (findByCode)
          {
                if(id!=undefined && findByCode.id===id){
                  return true
                }else
                {
                  throw new CustomError(500032, 'El codigo ingresado '+ code + ' ya corresponde a otro producto.');
                }
          }else
          {
            return true
          }
   }catch(error){
          if (error instanceof CustomError) throw error;
          throw new CustomError(500033, 'Error al obtener los productos');
   }
  
  }

  createProduct (newProduct){
    let product = new Product(
      newProduct.id,
      newProduct.title,
      newProduct.description,
      newProduct.thumbnail,
      newProduct.status,
      newProduct.category,
      newProduct.code,
      newProduct.stock,
      newProduct.price);

      return product;
  }

  async addProduct(request) {

    try{
      if (await this.getProductByCode(request.code)) {
        const product = this.createProduct(request);
        this.fileManager.saveDataToFile(product);
        return product;
      } 
    }catch(error){
      if (error instanceof CustomError) throw error;
      throw new CustomError(500110, 'Error al agregar el producto');
    }
   
  }

  async updateProduct(request) {
  try{
    const returnedProduct=await this.getProductById(request.id);
        if(!returnedProduct===false){
                if (await this.getProductByCode(request.code,request.id)) {

                          const products =await this.getProducts().map(product => {
                                  if (product.id === request.id) {
                                            const updated =  { ...product , ...request , };
                                            const UpdatedProduct = this.createProduct(updated);                      
                                            return UpdatedProduct;
                                  } else {
                                          let UpdatedProduct=product
                                          return UpdatedProduct;
                                  }
                          });
                          this.fileManager.saveAllDataToFile(products)
                          return returnedProduct;
                  } 
          } 
    }catch(error){
      if (error instanceof CustomError) throw error;
      throw new CustomError(500210, 'Error al actualizar el producto');
    }
  }

  async deleteProduct(id) {
//try{}catch(){}
    try{
      const deleteThis = await this.getProductById(id);

        if(!deleteThis===false){
          const products = await this.fileManager.getDataFromFile().filter(product => product.id !== id);
          this.fileManager.saveAllDataToFile(products);
          return deleteThis
        }
    }
    catch(error){
      if (error instanceof CustomError) throw error;
      throw new CustomError(500310, 'Error al borrar el producto');
    }
  }
}
export default ProductsManager;

