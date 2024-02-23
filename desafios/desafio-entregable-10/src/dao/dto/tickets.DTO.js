export default class TicketsDTO {
    constructor({ id, code, date, amount, mail }) {
        if (id) this.id = id;
        if (code) this.code = code;
        if (date) this.date = date;
        if (amount) this.amount = amount;
        if (mail) this.mail = mail;
    }

    static build(data) {
        return new TicketsDTO(data);
    }

    static fromDatabaseData(data) {
        if (!data) return;
        return new TicketsDTO({
            id: data._id ? data._id.toString() : undefined,
            code: data.code,
            date: data.purchase_datetime,
            amount: data.amount,
            mail: data.purchaser,
        });
    }

    toDatabaseData() {
        const databaseData = {
            _id: this.id,
            code: this.code,
            purchase_datetime: this.date,
            amount: this.amount,
            purchaser: this.mail,
        };

        for (const prop in databaseData) {
            if (databaseData[prop] === undefined) {
                delete databaseData[prop];
            }
        }

        return databaseData;
    }
}