import multer from "multer";
import { logger } from "./logger.config.js";
import { __dirname } from "../utils.js";

//__dirname.replace("\\src","")+'
 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        switch(file.fieldname){
            case 'avatar' : cb(null,'./public/images/profiles/')
            break;
            case 'userIdDoc' : cb(null,'./public/images/documents/')
            break;
            case 'userAddressDoc' : cb(null,'./public/images/documents/')
            break;
            case 'userAccountDoc' : cb(null,'./public/images/documents/')
            break;
            case 'productImage' : cb(null,'./public/images/products/')
            break;
        }

     },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
     }
  })
  
 export const upload = multer({ storage: storage })