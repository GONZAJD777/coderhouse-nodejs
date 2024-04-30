import multer from "multer";
import { logger } from "./logger.config.js";
import { __dirname } from "../utils.js";
import { MODE } from "./config.js";

//__dirname.replace("\\src","")+'
///img\profiles\avatar-1711492134779-391640188.png
const basepath = (__dirname.replace("\\src","")).replace("/src","");
logger.log('info','MULTER is using this basepath ---> '+basepath)   

 const storage = multer.diskStorage({
   
    destination: function (req, file, cb) {
        switch(file.fieldname){

            case 'avatar' : cb(null, basepath +'/public/img/'+MODE.toLocaleLowerCase()+'/profiles/')
            break;
            case 'userIdDoc' : cb(null,basepath +'/public/img/'+MODE.toLocaleLowerCase()+'/documents/')
            break;
            case 'userAddressDoc' : cb(null,basepath +'/public/img/'+MODE.toLocaleLowerCase()+'/documents/')
            break;
            case 'userAccountDoc' : cb(null,basepath +'/public/img/'+MODE.toLocaleLowerCase()+'/documents/')
            break;
            case 'productImage' : cb(null,basepath +'/public/img/'+MODE.toLocaleLowerCase()+'/products/')
            break;
        }
     },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ".png")
     }
  })
  
 export const upload = multer({ storage: storage })