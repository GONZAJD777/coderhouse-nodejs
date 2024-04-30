import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import {logger} from "./logger.config.js";
import {__dirname} from "../utils.js";
import { PORT } from "./config.js";


   
const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:"Documentcion Coder E-Commmerce",
            description:"API E-Commerce"
        }
    },
    apis: ["./src/docs/**/*.yaml"],
    servers: [
        {
          url: "http://localhost:"+PORT+"/",
          description: "Local server"
        }
      ]
    
};

const specs = swaggerJsDoc(swaggerOptions);
export const swaggerServe = swaggerUiExpress.serve;
export const swaggerSetup = swaggerUiExpress.setup(specs);
