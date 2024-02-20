import winston from "winston";
import { MODE } from "../config/config.js";


let logger;

    if(MODE === "DEV") {  
        logger = new winston.createLogger({ 
                transports: [ 
                    new winston.transports.Console({level: "debug"})
                ] 
        });
    
    }


    if(MODE === "PROD") {
        logger = new winston.createLogger({
                transports: [
                    new winston.transports.Console({level: "info"}),
                    new winston.transports.Console({level: "warning"}),
                    new winston.transports.File({level: "error", filename:"./errors.log"}),
                    new winston.transports.File({level: "fatal", filename:"./errors.log"})
                ]

        });
    }

export const addLogger = (request,response,next) => {
    request.logger = logger;
    request.logger.http(request.method + ' en ' + request.url + ' - ' + new Date().toLocaleTimeString());
    next();
}