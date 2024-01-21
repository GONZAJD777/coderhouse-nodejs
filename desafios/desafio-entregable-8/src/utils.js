import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { error } from "console";

///////////////////////////////////////////////////////////////////////////////////////////////
const COOKIE_OPTS = { signed: true, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }

export async function appendJwtAsCookie(req, res, next) {
  try {
    const accessToken = generateToken(req.user)
    res.cookie('token', accessToken, COOKIE_OPTS)
    next()
  } catch (error) {
    next(error)
  }
}

export async function removeJwtFromCookies(req, res, next) {
  res.clearCookie('token', COOKIE_OPTS)
  next()
}


///////////////////////////////////////////////////////////////////////////////////////////////
export const cookieExtractor = (request) => {
    let token = null;
    if (request && request.cookies){
        token = request.signedCookies['token']
    }
    return token;
}
///////////////////////////////////////////////////////////////////////////////////////////////
const PRIVATE_KEY = "CoderS3cR3tC0D3"
export const generateToken = (user) => {
    const token = jwt.sign({user},PRIVATE_KEY,{expiresIn:'24h'});
    return token;
}
export const authToken = (request,response,next) => {
    const authHeader = request.headers.authorization;
    if(!authHeader) return response.status(401).send({error:"Not Authenticated"}); //si no hay header, es porque no hay token y por tanto no ha sido autenticado

    const token = authHeader.split (' ')[1];
    jwt.verify(token,PRIVATE_KEY,(error,credentials) => {

        if(error) return response.status(403).send({error:"Not Authorized"});
        request.user=credentials.user;
        next();
    })
}

///////////////////////////////////////////////////////////////////////////////////////////////
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidPassword = (user,password) => bcrypt.compareSync(password,user[0].password);
///////////////////////////////////////////////////////////////////////////////////////////////

export const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
