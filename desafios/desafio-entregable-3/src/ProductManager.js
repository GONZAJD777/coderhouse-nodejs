import Product from '../model/Product.js';
import fs from 'fs';

class ProductManager {

  path;
 
  
  constructor(path) {
    this.path = path;
    this.createFile();
    this.getLatestIdProduct();

  }

  createFile() {
    if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, JSON.stringify([]), 'utf8');
  }

  //******************** READING ********************
  getLatestIdProduct() {
    try {
      const products = this.getProducts();
      if (products.length !== 0) Product.id = products.reduce((prev, current) => (prev.id > current.id ? prev : current)).id;
      else Product.id = 0;
    } catch (error) {
      console.log("20001 -> ", error);
    }
  }

  getProducts(  query  ) {
    try {
      
      let result = this.getProductsFromFile();

      if (query===undefined){
        return result;
      } else {    
        //let b = Number(limit);
        return result.slice(0,query.limit);
      }
    } catch (error) {
      console.log("20010 -> ", error);
    }
  }

  getProductsFromFile() {
    return JSON.parse(fs.readFileSync(this.path, 'utf-8'));
  }
  //******************** READING ********************

  //******************** UPDATE ********************
  updateProduct(updateProduct) {
    try {
       if (this.getProductByCode(updateProduct.code)==undefined) {
          const products = this.getProducts().map(product => {
              if (product.id === updateProduct.id) {
                product.title = updateProduct.title;
                product.description = updateProduct.description;
                product.price = updateProduct.price;
                product.thumbnail = updateProduct.thumbnail;
                product.code = updateProduct.code;
                product.stock = updateProduct.stock;
                return product;
              } else {
                return product;
              }
          });
          this.saveProductsToFile(products);
          let result ='\n Se actualizado el siguiente objeto nro: ' + updateProduct.id + '\n' + JSON.stringify(updateProduct, null, '\t') + '\n';
          return result;
        } else {
          let result = '\n El codigo ingresado "' + updateProduct.code + '" ya pertenece a otro producto cargado.\n';
          this.getLatestIdProduct();
          return result;
        }
    } catch (error) {
      console.log("20030 -> ", error);
    }
    
  }
  //******************** UPDATE ********************

  //******************** DELETE ********************
  deleteProduct(id) {
    try {
      const products = this.getProductsFromFile().filter(product => product.id !== id);
      this.saveProductsToFile(products);
    } catch (error) {
      console.log("20040 -> ", error);
    }
  }

  //******************** WRITE ********************

  saveProductToFile(product) {
    const products = this.getProductsFromFile();
    products.push(product);
    this.saveProductsToFile(products);
  }

  saveProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'), 'utf8');
    this.getLatestIdProduct();
  }


//******************** WRITE ********************
 

addProduct(product) {
  try {
        if (this.getProductByCode(product.code)==undefined) {
          this.saveProductToFile(product);
          let result ='\n Se agrego el siguiente objeto: \n' + JSON.stringify(product, null, '\t') + '\n';
          return result;
        
        } else {
          let result = '\n El codigo ingresado "' + product.code + '" ya pertenece a otro producto cargado.\n';
          this.getLatestIdProduct();
          return result;
        }
      } catch (error) {
        console.log("20020 -> ", error);
      }  
}

getProductById(id) {
  try {
    return this.getProducts().find(product => product.id === id);
  } catch (error) {
    console.log("20011 -> ", error);
  }
}

getProductByCode(code) {
  try {
    return this.getProducts().find(product => product.code === code);
  } catch (error) {
    console.log("20012 -> ", error);
  }
}



}
export default ProductManager;

