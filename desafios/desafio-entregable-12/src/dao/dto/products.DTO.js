export default class ProductsDTO {
    constructor({ id, title, description, category, price, thumbnails, code, stock, quantity }) {
        if (id) this.id = id;
        if (title) this.title = title;
        if (description) this.description = description;
        if (category) this.category = category;
        if (price) this.price = price;
        if (thumbnails) this.thumbnails = thumbnails;
        if (code) this.code = code;
        if (stock) this.stock = stock;
        if (quantity) this.quantity = quantity;
    }

    static build(data) {
        return new ProductsDTO(data);
    }

    static fromDatabaseData(data) {
        if (!data) return;
        return new ProductsDTO({
            id: data._id.toString(),
            title: data.title,
            description: data.description,
            category: data.category,
            price: data.price,
            thumbnails: data.thumbnails,
            code: data.code,
            stock: data.stock,
            quantity: data.quantity,
        });
    }

    toDatabaseData() {
        const databaseData = {
            _id: this.id,
            title: this.title,
            description: this.description,
            category: this.category,
            price: this.price,
            thumbnails: this.thumbnails,
            code: this.code,
            stock: this.stock,
            quantity: this.quantity,
        };

        for (const prop in databaseData) {
            if (databaseData[prop] === undefined) {
                delete databaseData[prop];
            }
        }

        return databaseData;
    }
}