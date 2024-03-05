export default class CartsDTO {
    constructor({ id, products, createdAt, updatedAt }) {
        if (id) this.id = id;
        if (products) this.products = products;
        if (createdAt) this.createdAt = createdAt;
        if (updatedAt) this.updatedAt = updatedAt;
    }

    static build(data) {
        return new CartsDTO(data);
    }

    static fromDatabaseData(data) {
        if (!data) return;
        return new CartsDTO({
            id: data._id ? data._id.toString() : undefined,
            products: data.products,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        });
    }

    toDatabaseData() {
        const databaseData = {
            _id: this.id,
            products: (this.products) ? this.products.map(item => ({
                product: (item.id) ? item.id : item.product._id.toString(),
                quantity: item.quantity
            })) : undefined,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };

        for (const prop in databaseData) {
            if (databaseData[prop] === undefined) {
                delete databaseData[prop];
            }
        }

        return databaseData;
    }
}