import {productsRouter} from "./routers/api/products.router.js";
import {cartsRouter} from "./routers/api/carts.router.js"
import {viewsRouter} from "./routers/web/views.router.js";
import {sessionRouter} from "./routers/api/sessions.router.js";
import {messagesRouter} from "./routers/web/messages.router.js";
import {utilsRouter} from "./routers/api/utils.router.js";
import initializePassport from "./config/passport.config.js";
import initializeSocket from "./config/socket.config.js";
import { CKE_SCT, CNX_STR, PORT } from "./config/config.js";
import { __dirname } from "./utils.js";
import express from "express";
import handlebars from 'express-handlebars'
import http from 'http';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from "passport";
import { addLogger } from "./middlewares/logger.middleware.js";


await mongoose.connect(CNX_STR);
const app = express();
const server = http.createServer(app);
initializePassport();
initializeSocket(server);

app.use(addLogger);
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser(CKE_SCT));
app.use(passport.initialize());
app.use(express.static('./public'));
app.use(express.static('./views'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', "./views");

app.use('/api',productsRouter);
app.use('/api',cartsRouter);
app.use('/api',sessionRouter);
//app.use('/api',utilsRouter);
app.use('/',viewsRouter);
app.use('/',messagesRouter);

server.listen(PORT, () => 
console.log('Listening on port: '+ PORT + "\n" + 'Process Id: '+ process.pid));
server.on('error', error => console.log('Server error '+ error));

//Para inciar el servidor 
//----------------------
//node src/app.js -p -s <MONGO|MOONGOSE|FILESYSTEM>
// -p --> indica que se inciara con la parametria de PRODUCCION
// -s --> indica que tipo de DAO se utilizara en la persistencia y el tipo de almacenamiento 
//        requiere ademas que se indique 1 de los 3 modos MONGO|MOONGOSE|FILESYSTEM
//En cualquiera de los casos si no se espeficican estos valores, el servidor se iniciara
//en ambiente DEVELOPER (DEV) con su correspondiente parametria y persistencia FILESYSTEM 
