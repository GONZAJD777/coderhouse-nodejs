import winston from "winston";
import { MODE } from "./config.js";
    
export const cusLogLevelsOpts = {
        levels : {
            fatal : 0,
            error : 1,
            warning: 2,
            info : 3,
            http : 4,
            debug : 5,
        },
        colors : {
            fatal:'red',
            error:'red',
            warning:'yellow',
            info:'blue',
            http : 'magenta',
            debug:'green',
        }};

export const logger = winston.createLogger({ 
        levels:cusLogLevelsOpts.levels,
        transports: [] 
        });



    if(MODE === "DEV") {  
        logger.add(new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors:cusLogLevelsOpts.colors}),
                winston.format.simple()
            )
        }));
    }


    if(MODE === "PROD") {
        logger.add(new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors:cusLogLevelsOpts.colors}),
                winston.format.simple()
            )   
        }));
                 
        logger.add(new winston.transports.File({
            level: "warning", //se coloca warning para incluir en el archivo de log los resets del servicio
            filename:"./errors.log",
            format: winston.format.combine(
                winston.format.colorize({colors:cusLogLevelsOpts.colors}),
                winston.format.simple()
            )   
        }));            
                      
    }