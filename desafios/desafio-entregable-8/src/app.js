// Just Export Default objects can be imported as default
// not explicit exports should be explcited inside {}
//import ProductsManager from "./dao/fileSystem/managers/products.manager.js";
import {productsRouter} from "./ruteo/routers/api/products.router.js";
import {cartsRouter} from "./ruteo/routers/api/carts.router.js"
import {viewsRouter} from "./ruteo/routers/web/views.router.js";
import {sessionRouter} from "./ruteo/routers/web/sessions.router.js";
import {messagesRouter} from "./ruteo/routers/web/messages.router.js";
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


await mongoose.connect(CNX_STR);
const app = express();
const server = http.createServer(app);
initializePassport();
initializeSocket(server);

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser(CKE_SCT));
app.use(passport.initialize());
app.use(express.static('./public'));
app.use(express.static('./views'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/api',productsRouter);
app.use('/api',cartsRouter);
app.use('/api',sessionRouter);
app.use('/',viewsRouter);
app.use('/',messagesRouter);

server.listen(PORT, () => 
    console.log('Listening on port: '+ PORT + "\n" +
                'Process Id: '+ process.pid)
    );
    
server.on('error', error => console.log('Server error '+ error));


