export default class UserDocsDTO {
    constructor({name, reference}) {
        if (name) this.name = name;
        if (reference) this.reference = reference;
            
    }

    static build(data) {
        return new UserDocsDTO(data);
    }

    static buildFromMulter({avatar,userIdDoc,userAddressDoc,userAccountDoc}) {
        const documents=[];    
        if(avatar) documents.push(new UserDocsDTO({name:avatar[0].fieldname,reference:avatar[0].path}));
        if(userIdDoc)documents.push(new UserDocsDTO({name:userIdDoc[0].fieldname,reference:userIdDoc[0].path})); 
        if(userAddressDoc)documents.push(new UserDocsDTO({name:userAddressDoc[0].fieldname,reference:userAddressDoc[0].path})); 
        if(userAccountDoc)documents.push(new UserDocsDTO({name:userAccountDoc[0].fieldname,reference:userAccountDoc[0].path}));         
        return documents;
    }

    static docsStandarResp(data) {
        if (!data) return;
        const documents=[]; 
        data.forEach(element => {
            documents[element.name]=element.reference.replace("public","")               
        });
        return documents;
    }

    static userBasicInfoResp(data) {
        if (!data) return;
        return new UserDocsDTO({
            name: data.name,
            reference: data.reference,
        });
    }

    toDatabaseData() {
        const databaseData = {
            name: this.name,
            reference: this.reference,
        };

        for (const prop in databaseData) {
            if (databaseData[prop] === undefined) {
                delete databaseData[prop];
            }
        }

        return databaseData;
    }
}
