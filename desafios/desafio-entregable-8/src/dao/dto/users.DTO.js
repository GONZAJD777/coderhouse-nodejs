export default class UserDTO {
    constructor({ firstname, lastname, email, age, password, role, cart }) {
        if (firstname) this.firstname = firstname;
        if (lastname) this.lastname = lastname;
        if (email) this.email = email;
        if (age) this.age = age;
        if (password) this.password = password;
        if (role) this.role = role;
        if (cart) this.cart = cart;
    }

    static build(data) {
        return new UserDTO(data);
    }

    static build(data, fields) {
        return new UserDTO(data);
    }

    static fromDatabaseData(data) {
        if (!data) return;
        return new UserDTO({
            id: data._id ? data._id.toString() : undefined,
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            age: data.age,
            password: data.password,
            role: data.role,
            cart: data.cart,
        });
    }

    toDatabaseData() {
        const databaseData = {
            firstName: this.firstname,
            lastName: this.lastname,
            email: this.email,
            age: this.age,
            password: this.password,
            role: this.role,
            cart: this.cart,
        };

        for (const prop in databaseData) {
            if (databaseData[prop] === undefined) {
                delete databaseData[prop];
            }
        }

        return databaseData;
    }
}
