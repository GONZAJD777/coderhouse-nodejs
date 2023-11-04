const Product = require('../model/Product.js');

class ProductManager {
  #productId=0;
  #arrayProduct;
  
  constructor() {
    this.#arrayProduct = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    let product = new Product(this.productId,title, description, price, thumbnail, code, stock);
    if (this.getProductByCode(code)==undefined) {
      this.#arrayProduct.push(product);
      return product;
    } else {
      throw new Error ('El codigo ingresado "' + code + '" ya pertenece a otro producto cargado.');
    }
    
  }

  get productId ()
  {
    this.#productId=++this.#productId;
    let productId =this.#productId;
    //console.log('id de producto '+productsId);
    return productId;
  }
  getProductByCode(code) {
    return this.#arrayProduct.find(product => product.code === code);
  }

  getProductById(id) {
    return this.#arrayProduct.find(product => product.id === parseInt(id)).asPOJO();
  }

  getProducts() {
    return this.#arrayProduct.map (e => e.asPOJO());
  }
}

module.exports = ProductManager;

