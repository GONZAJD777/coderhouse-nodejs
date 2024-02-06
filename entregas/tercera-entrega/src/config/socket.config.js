import { Server } from "socket.io";
import ProductsManager from "../services/mongo/products.manager.js";

const productManager = new ProductsManager();

const initializeSocket = (server) => {

    const io = new Server(server);

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
    
                socket.on('disconnect', () => {
                console.log('Cliente desconectado');
        }
    );
                    
                    const listProducts = await productManager.getProducts();
                    io.emit('sendProducts', listProducts); 
    });

}

export default initializeSocket