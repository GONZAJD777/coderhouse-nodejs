import { Server } from "socket.io";
import ProductsManager from "../services/products.manager.js";
import { logger } from "./logger.config.js";

const productManager = new ProductsManager();
export let io;

export const initializeSocket = (server) => {

    io = new Server(server);

    io.on('connection', async (socket) => {

        logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + 'Cliente conectado id: '+socket.id);
    
            socket.on('disconnect', () => {
                    logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +'Cliente desconectado id: '+socket.id);
                }
            );
                    
            const listProducts = await productManager.getProducts();
            io.emit('sendProducts', listProducts); 
    });
}

export const emitProducts = async () => { 
        const listProducts = await productManager.getProducts();
        io.emit('sendProducts', listProducts); 
    }
