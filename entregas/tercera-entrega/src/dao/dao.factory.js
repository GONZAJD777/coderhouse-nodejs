import {PERSISTENCE} from "../config/config.js";
import ProductsFileSystemDAO from "./fileSystem/dao/products.DAO.js";
import UsersFileSystemDAO from "./fileSystem/dao/users.DAO.js";
import CartsFileSystemDAO from "./fileSystem/dao/carts.DAO.js";
import TicketsFileSystemDAO from "./fileSystem/dao/tickets.DAO.js";
import MessagesFileSystemDAO from "./fileSystem/dao/messages.DAO.js";

export function  getPersistence() {
        //Tengo una lista de las ENTIDADES que necesito modelar a nivel persistencia.
        const productsFilePath = "\\dao\\fileSystem\\data\\products.json";
        const usersFilePath = "\\dao\\fileSystem\\data\\users.json";
        const carstFilePath = "\\dao\\fileSystem\\data\\carts.json";
        const ticketsFilePath = "\\dao\\fileSystem\\data\\tickets.json";
        const messagesFilePath = "\\dao\\fileSystem\\data\\messages.json";
        
        let ProductsDAO;
        let CartsDAO;
        let UsersDAO;
        let TicketsDAO;
        let MessagesDAO;
        

        switch (PERSISTENCE) {
            case "MEMORY": {
                break;
            }
            case "FILESYSTEM": {
                ProductsDAO  = new ProductsFileSystemDAO(productsFilePath);
                UsersDAO = new UsersFileSystemDAO(usersFilePath);
                CartsDAO = new CartsFileSystemDAO(carstFilePath);
                TicketsDAO = new TicketsFileSystemDAO(ticketsFilePath);
                MessagesDAO = new MessagesFileSystemDAO(messagesFilePath);   

                //ProductsDAO = (await import('./fileSystem/dao/products.DAO.js')).default;
                //CartsDAO = (await import('./fileSystem/dao/products.DAO.js')).default;
                //UsersDAO = (await import('./fileSystem/dao/products.DAO.js')).default;
                //TicketsDAO = (await import('./fileSystem/dao/products.DAO.js')).default;
                break;
            }
            case "MONGO": {
                //ProductsDAO = (await import('./mongo/dao/products.DAO.js')).default;
                //CartsDAO = (await import('./mongo/dao/products.DAO.js')).default;
                //UsersDAO = (await import('./mongo/dao/products.DAO.js')).default;
                //TicketsDAO = (await import('./mongo/dao/products.DAO.js')).default;
                break;
            }
        }
        return {
            ProductsDAO,
            CartsDAO,
            UsersDAO,
            TicketsDAO,
            MessagesDAO
        }
    }

