import { logger,cusLogLevelsOpts } from "../../config/logger.config.js";
import responseErrorHandler from "../../middlewares/error.response.middleware.js";

export async function loggerTestController (request,response,next){
    try{
        const levels = Object.keys(cusLogLevelsOpts.levels);
        let result={test:{}}
        for (let index = 0; index < levels.length; index++){

            logger.log(levels[index], new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + 'Ejecutando prueba de log '+levels[index]);
            result.test[levels[index]] = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + 'Ejecutando prueba de log '+levels[index].toString();
        }
        result.logger={};
        for (let index = 0; index < logger.transports.length; index++){
            result.logger['transport-'+index.toString()] =  { 
                                                                type:logger.transports[index].name,
                                                                level:logger.transports[index].level,
                                                                filepath:logger.transports[index].dirname,
                                                                filename:logger.transports[index].filename,
                                                            };
        }
        result.levels=cusLogLevelsOpts.levels;
        result.colors=cusLogLevelsOpts.colors;

        return response.json({Result: 'OK' , Operation: 'LoggerTest',Code: "200" ,Message: 'LoggerTest result', Object: result});

    } catch (error)
    { 
        responseErrorHandler(error,request,response,next);
    } 
}