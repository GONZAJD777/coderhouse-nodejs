class Product {

    static id = 0;

    constructor (title, description, price, thumbnail, code, stock) {
        this.id = ++Product.id;
        this.title = title;                    //(nombre del producto)
        this.description = description;        //(descripción del producto)
        this.price = price;                    //(precio)
        this.thumbnail = thumbnail;            //(ruta de imagen)
        this.code = code;                      //(código identificador)
        this.stock = stock;                    //(número de piezas disponibles)
    }
}

module.exports = Product;
