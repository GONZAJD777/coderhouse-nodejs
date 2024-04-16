export default class ProductsDTO {
    constructor({ id, title, description, category, status, price, thumbnail, code, stock,owner }) {
        if (id) this.id = id;
        if (title) this.title = title;
        if (description) this.description = description;
        if (category) this.category = category;
        if (status) this.status = status;
        if (price) this.price = price;
        if (thumbnail) this.thumbnail = thumbnail;
        if (code) this.code = code;
        if (stock) this.stock = stock;
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
            thumbnail: data.thumbnail,
            code: data.code,
            stock: data.stock,
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
            thumbnail: this.thumbnail,
            code: this.code,
            stock: this.stock,
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