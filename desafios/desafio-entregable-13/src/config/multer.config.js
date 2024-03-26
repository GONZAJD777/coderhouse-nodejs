import multer from "multer";
import { logger } from "./logger.config.js";
import { __dirname } from "../utils.js";

//__dirname.replace("\\src","")+'
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        switch(file.fieldname){
            case 'avatar' : cb(null,'/public/profiles/')
            break;
            case 'userIdDoc' : cb(null,'/public/documents/')
            break;
            case 'userAddressDoc' : cb(null,'/public/documents/')
            break;
            case 'userAccountDoc' : cb(null,'/public/documents/')
            break;
            case 'productImage' : cb(null,'/public/products/')
            break;
        }

     },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
     }
  })
  
 export const upload = multer({ storage: storage })