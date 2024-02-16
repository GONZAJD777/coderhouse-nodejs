import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";


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
