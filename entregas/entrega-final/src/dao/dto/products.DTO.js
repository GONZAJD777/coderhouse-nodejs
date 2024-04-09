export default class ProductsDTO {
    constructor({ id, title, description, category, status, price, thumbnails, code, stock, quantity,owner }) {
        if (id) this.id = id;
        if (title) this.title = title;
        if (description) this.description = description;
        if (category) this.category = category;
        if (status) this.status = status;
        if (price) this.price = price;
        if (thumbnails) this.thumbnails = thumbnails;
        if (code) this.code = code;
        if (stock) this.stock = stock;
        if (quantity) this.quantity = quantity;
        if (owner) this.owner = owner;
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
            status: data.status,
            price: data.price,
            thumbnails: data.thumbnails,
            code: data.code,
            stock: data.stock,
            quantity: data.quantity,
            owner: data.owner
        });
    }

    toDatabaseData() {
        const databaseData = {
            _id: this.id,
            title: this.title,
            description: this.description,
            category: this.category,
            status: this.status,
            price: this.price,
            thumbnails: this.thumbnails,
            code: this.code,
            stock: this.stock,
            quantity: this.quantity,
            owner: this.owner
        };

        for (const prop in databaseData) {
            if (databaseData[prop] === undefined) {
                delete databaseData[prop];
            }
        }

        return databaseData;
    }
}