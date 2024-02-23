import { Server } from "socket.io";
import ProductsManager from "../services/products.manager.js";
import { logger } from "./logger.config.js";

const productManager = new ProductsManager();

const initializeSocket = (server) => {

    const io = new Server(server);

    io.on('connection', async (socket) => {

        logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + 'Cliente conectado id: '+socket.id);
   
        socket.on('addProduct', async (obj) => {
                    try {
                        await productManager.addProduct(obj);
                    }catch (error){  
                        logger.log('error',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + {Result: 'ERROR', Operation: 'Create' ,Code:error.code, Message: error.message})                        
                    }
                    const listProducts = await productManager.getProducts();
                    io.emit('sendProducts', listProducts);
                }
            );
    
            socket.on('deleteProduct', async (id) => {
                    try {
                        await productManager.deleteProduct(id);
                    }catch (error){  
                        logger.log('error',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + {Result: 'ERROR', Operation: 'Delete' ,Code:error.code, Message: error.message})
                    }
                    const listProducts = await productManager.getProducts();
                    io.emit('sendProducts', listProducts);
                }
            );
    
            socket.on('disconnect', () => {
                    logger.log('info',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +'Cliente desconectado id: '+socket.id);
                }
    );
                    
                    const listProducts = await productManager.getProducts();
                    io.emit('sendProducts', listProducts); 
    });

}

export default initializeSocket