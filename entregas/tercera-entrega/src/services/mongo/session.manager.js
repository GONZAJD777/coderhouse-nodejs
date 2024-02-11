import sessionModel from "../../dao/mongo/mongoose/session.js";

export default class SessionManager {
 
    getSession = async (sId) => {
        const currentDate = new Date();    
        
        return sessionModel.findOne({_id:sId,sExpireDate:{$gt:currentDate}}).lean();
    }

    createSession = async (sEmail) => {
        const currentDate = new Date()
        const futureDate = new Date(currentDate)
        futureDate.setDate(futureDate.getDate() + 7)

        return sessionModel.create({sEmail:sEmail,sExpireDate:futureDate});
    }

    deleteSession = async (sId) => {
        const currentDate = new Date(); 

        return sessionModel.findByIdAndUpdate({_id:sId},{$set:{sExpireDate:currentDate}});
    }

}