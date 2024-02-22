import { logger } from "../config/logger.config.js"

export const addLogger = (request,response,next) => {
    request.logger = logger;
    request.logger.log('http',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +request.method + ' ' + request.url );
    next();
}