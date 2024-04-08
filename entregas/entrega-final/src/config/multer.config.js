import multer from "multer";
import { logger } from "./logger.config.js";
import { __dirname } from "../utils.js";
import { MODE } from "./config.js";

//__dirname.replace("\\src","")+'
///img\profiles\avatar-1711492134779-391640188.png
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        switch(file.fieldname){
            case 'avatar' : cb(null,'public/img/'+MODE+'/profiles/')
            break;
            case 'userIdDoc' : cb(null,'public/img/'+MODE+'/documents/')
            break;
            case 'userAddressDoc' : cb(null,'public/img/'+MODE+'/documents/')
            break;
            case 'userAccountDoc' : cb(null,'public/img/'+MODE+'/documents/')
            break;
            case 'productImage' : cb(null,'public/img/'+MODE+'/products/')
            break;
        }

     },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ".png")
     }
  })
  
 export const upload = multer({ storage: storage })