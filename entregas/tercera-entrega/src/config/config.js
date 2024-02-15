import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option("-p, --prod", "entorno de ejecucion",false)
       .option("-s, --pers <persistence>", "modo de persistencia", false)
       .parse();

const {prod,pers} = program.opts();
//const {storage} = program.opts();

const path = prod ? "./.prod.env" : "./.dev.env"
dotenv.config( {path} );

if (prod){
       console.log("Se inicializa el servidor con la parametria de PRODUCCION");
} else {
       console.log("No se a especificado el ambiente, se incializa el servicio por defecto con la parametria de DESARROLLO");
}

let persistence;
switch (pers.toString().toUpperCase()) {
          case "MONGOOSE": {
              persistence="MONGOOSE";
              console.log("Se inicializa el servidor con persistencia "+persistence);
              break;
          }
          case "FILESYSTEM": {  
              persistence="FILESYSTEM";
              console.log("Se inicializa el servidor con persistencia "+persistence);
              break;
          }
          case "MONGO": {   
              persistence="MONGO";
              console.log("Se inicializa el servidor con persistencia "+persistence);
              break;
          }
          default:{   
              persistence="FILESYSTEM";
              console.log("No se a especificado el modo de persistencia, se inicializa el servidor por defecto con "+persistence);
              break;
          }
}

export const PORT = process.env.PORT;
export const CNX_STR = process.env.CNX_STR;
export const CKE_SCT = process.env.CKE_SCT;

export const GITHUB_CLT_ID = process.env.GITHUB_CLT_ID;
export const GITHUB_CLT_SCT = process.env.GITHUB_CLT_SCT;
export const GITHUB_CB_URL = process.env.GITHUB_CB_URL;

export const ADMIN_ID = process.env.ADMIN_ID;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASS = process.env.ADMIN_PASS;
export const ADMIN_FNAME = process.env.ADMIN_FNAME;
export const ADMIN_LNAME = process.env.ADMIN_LNAME;
export const ADMIN_ROLE = process.env.ADMIN_ROLE;
export const ADMIN_CART = process.env.ADMIN_CART;

export const GITHUB_DEF_FNAME = process.env.GITHUB_DEF_FNAME;
export const GITHUB_DEF_LNAME = process.env.GITHUB_DEF_LNAME;
export const GITHUB_DEF_PASS = process.env.GITHUB_DEF_PASS;
export const PERSISTENCE = persistence; //it could be MONGO|FILESYSTEM|MONGOOSE