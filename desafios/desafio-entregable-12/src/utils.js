import { dirname } from "path";
import { fileURLToPath } from "url";
import { CKE_SCT,CKE_AGE} from "./config/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "./config/logger.config.js";

const PRIVATE_KEY = CKE_SCT;

///////////////////////////////////////////////////////////////////////////////////////////////
// COOKIE TOKEN EXTRACTION
export const cookieExtractor = (request) => {
    let token = null;
    if (request && request.cookies){
        token = request.signedCookies['token']
    }
    return token;
}
///////////////////////////////////////////////////////////////////////////////////////////////
// PASSWORD HASHING
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password);
///////////////////////////////////////////////////////////////////////////////////////////////
//BASE PATH
export const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

///////////////////////////////////////////////////////////////////////////////////////////////
//JWT Generator
export const generateToken = (user,expiresIn) => {
    let token;
    if(expiresIn){
      token = jwt.sign({user},PRIVATE_KEY,{expiresIn:expiresIn});
    }else {
      token = jwt.sign({user},PRIVATE_KEY,{expiresIn:'24h'});
    }
    return token;
  }
///////////////////////////////////////////////////////////////////////////////////////////////
//JWT verify
  export const verifyToken = (token) => {
        try {
            const verifiedToken = jwt.verify(token,PRIVATE_KEY);
            
            return verifiedToken.user;

        } catch (error){
            logger.log ('debug',error);
        }
  }

 