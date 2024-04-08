import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import {logger} from "./logger.config.js";
import {__dirname} from "../utils.js";


   
const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:"Documentcion Coder E-Commmerce",
            description:"API E-Commerce"
        }
    },
    apis: [__dirname+"\\docs\\**\\*.yaml"],
    
};

const specs = swaggerJsDoc(swaggerOptions);
export const swaggerServe = swaggerUiExpress.serve;
export const swaggerSetup = swaggerUiExpress.setup(specs);
