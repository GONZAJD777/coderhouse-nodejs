export default class UserDTO {
    constructor({id,firstName, lastName, email, age, password, role, cart,documents,lastConnection }) {
        if (id) this.id = id;
        if (firstName) this.firstName = firstName.toUpperCase();
        if (lastName) this.lastName = lastName.toUpperCase();
        if (email) this.email = email.toLowerCase();
        if (age) this.age = age;
        if (password) this.password = password;
        if (role) this.role = role;
        if (cart) this.cart = cart;
        if (documents) this.documents = documents;
        if (lastConnection) this.lastConnection = new Date(lastConnection); 
    
    }

    static build(data) {
        return new UserDTO(data);
    }

    static build(data, fields) {
        return new UserDTO(data);
    }

    static userFullInfoResp(data) {
        if (!data) return;
        return new UserDTO({
            id: data._id ? data._id.toString() : undefined,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            age: data.age,
            password: data.password,
            role: data.role,
            cart: data.cart,
            documents: data.documents,
            lastConnection: data.lastConnection
        });
    }

    static userBasicInfoResp(data) {
        if (!data) return;
        return new UserDTO({
            id: data._id ? data._id.toString() : undefined,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            lastConnection: data.lastConnection
        });
    }

    toDatabaseData() {
        const databaseData = {
            _id:this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            age: this.age,
            password: this.password,
            role: this.role,
            cart: this.cart,
            documents:this.documents,
            lastConnection:this.lastConnection
        };

        for (const prop in databaseData) {
            if (databaseData[prop] === undefined) {
                delete databaseData[prop];
            }
        }

        return databaseData;
    }
}
