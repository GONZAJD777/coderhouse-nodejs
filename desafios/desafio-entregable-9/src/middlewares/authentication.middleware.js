import jwt from "jsonwebtoken";
import { CKE_SCT,CKE_AGE } from "../config/config.js";


const PRIVATE_KEY = CKE_SCT;
const COOKIE_OPTS = { signed: true, httpOnly: true, maxAge: CKE_AGE  };

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

export const generateToken = (user) => {
    const token = jwt.sign({user},PRIVATE_KEY,{expiresIn:'24h'});
    return token;
  }