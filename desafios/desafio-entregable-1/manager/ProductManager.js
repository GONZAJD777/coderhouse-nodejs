const Product = require('../model/Product.js');

class ProductManager {
  arrayProduct;
  
  constructor() {
    this.arrayProduct = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    let product = new Product(title, description, price, thumbnail, code, stock);
    this.arrayProduct.push(product);
    return product;
  }

  getProductByCode(code) {
    return this.arrayProduct.find(product => product.code === code);
  }

  getProductById(id) {
    return this.arrayProduct.find(product => product.id === parseInt(id));
  }

  getProducts() {
    return this.arrayProduct;
  }
}

module.exports = ProductManager;