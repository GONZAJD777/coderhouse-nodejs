import { faker } from "@faker-js/faker";

export const mockProducts = async () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        const mockUser = {
            id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            category: faker.string.alphanumeric(4),
            status: faker.datatype.boolean(),
            price: faker.commerce.price(),
            stock: faker.number.int({ min: 0, max: 30 }),
            code: faker.string.alphanumeric(10),
            thumbnails: faker.image.urlLoremFlickr()
        }
        products.push(mockUser);
    }
    return products;
}