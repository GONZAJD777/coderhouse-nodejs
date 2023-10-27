const Product = require('../model/Product.js');

class ProductManager {

        arrayProduct;
        
    constructor() {
        this.arrayProduct = [];
    }

    addProduct (title, description, price, thumbnail, code, stock) {
        new Product (title, description, price, thumbnail, code, stock);
        this.arrayProduct.push(Product);
    }

    getProduct () {
        
    }

    getProductById () {

    }

}