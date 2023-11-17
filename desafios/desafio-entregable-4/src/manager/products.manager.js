import Product from '../model/product.js';
import FileManager from '../manager/files.manager.js';

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
      console.log("20001 -> ", error);
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
      console.log("20010 -> ", error);
    }
  }

  async getProductById(id) {
    let find = (await this.getProducts().find(product => product.id === id )||false)
    if (find) {
      return find;
    } else 
    {
      throw new Error ('40020|El codigo ID '+ id + ' no corresponde aun producto.') 
    }   
    
  }
  
  async getProductByCode(code,id) {
  
   let findByCode = (await this.getProducts().find(product => product.code === code)||false);
    
    if (findByCode)
      {
        if(id!=undefined && findByCode.id===id){
          return true
        }else
        {
          throw new Error ('40010|El codigo ingresado '+ code + ' ya corresponde a otro producto.')
        }
      }else
      {
        return true
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
    if (await this.getProductByCode(request.code)) {
        const product = this.createProduct(request);
        //this.saveProductToFile(product);
        this.fileManager.saveDataToFile(product);
        return product;
      } 
  }

  async updateProduct(request) {
    
    if(!this.getProductById(request.id)===false){
       if (this.getProductByCode(request.code,request.id)) {
          const products = this.getProducts().map(product => {
              if (product.id === request.id) {
            
               const updated =  { ...product , ...request , };
               const UpdatedProduct = this.createProduct(updated);
                       
                return UpdatedProduct;
              } else {
                let UpdatedProduct=product
                return UpdatedProduct;
              }

          });
          //this.saveProductsToFile(products);
          this.fileManager.saveAllDataToFile(products)
          return request;
        } 
      }
  }

  deleteProduct(id) {
   if(!this.getProductById(id)===false){
      const products = this.fileManager.getDataFromFile().filter(product => product.id !== id);
      this.fileManager.saveAllDataToFile(products);}
  }

}
export default ProductsManager;

