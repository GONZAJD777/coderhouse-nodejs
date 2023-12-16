// Just Export Default objects can be imported as default
// not explicit exports should be explcited inside {}
import ProductsManager from "./dao/mongo/managers/products.manager.js";
import CartsManager from "./dao/mongo/managers/carts.manager.js";
//import ProductsManager from "./dao/fileSystem/managers/products.manager.js";
import express from "express";
import handlebars from 'express-handlebars'
import { Server } from "socket.io";
import http from 'http';
import {productsRouter} from "./routers/products.router.js";
import {cartsRouter} from "./routers/carts.router.js"
import {viewsRouter} from "./routers/views.router.js";
import {messagesRouter} from "./routers/messages.router.js";
import { __dirname } from "./utils.js";
import mongoose from 'mongoose';

const productManager = new ProductsManager();
const cartManager = new CartsManager();
const app = express();
const PORT = 8080;
await mongoose.connect("mongodb+srv://gonzajd777:XQMG46lq12MZKpya@coderhousecluster.zcvvofh.mongodb.net/ecommerce?retryWrites=true&w=majority");


const server = http.createServer(app);
const io = new Server(server);
server.listen(PORT, () => console.log('Listening on port '+server.address().port+' ...'));

io.on('connection', async (socket) => {

    console.log('Cliente conectado id: ', socket.id);

    socket.on('addProduct', async (obj) => {
                try {
                    await productManager.addProduct(obj);
                }catch (error){  
                    socket._error({Result: 'ERROR', Operation: 'Create' ,Code:error.code, Message: error.message})
                    console.log({Result: 'ERROR', Operation: 'Create' ,Code:error.code, Message: error.message})
                }
                const listProducts = await productManager.getProducts();
                io.emit('sendProducts', listProducts);
            }
        );

        socket.on('deleteProduct', async (id) => {
                try {
                    await productManager.deleteProduct(id);
                }catch (error){  
                    socket._error({Result: 'ERROR', Operation: 'Delete' ,Code:error.code, Message: error.message})
                    console.log({Result: 'ERROR', Operation: 'Delete' ,Code:error.code, Message: error.message})
                }
                const listProducts = await productManager.getProducts();
                io.emit('sendProducts', listProducts);
            }
        );

        socket.on('AddToCart',async (cartId,productId) => {
                try {
                    await cartManager.updateCartAndProduct(cartId,productId,1,true);
                }catch (error){  
                    socket._error({Result: 'ERROR', Operation: 'AddToCart' ,Code:error.code, Message: error.message})
                    console.log({Result: 'ERROR', Operation: 'AddToCart' ,Code:error.code, Message: error.message})
                }
                
            }
        );

            socket.on('disconnect', () => {
            console.log('Cliente desconectado');
    }
);
                
                const listProducts = await productManager.getProducts();
                io.emit('sendProducts', listProducts); 
});

server.on('error', error => console.log('Server error '+ error));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('./public'));
app.use(express.static('./views'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/api',productsRouter);
app.use('/api',cartsRouter);
app.use('/',viewsRouter);
app.use('/',messagesRouter);



