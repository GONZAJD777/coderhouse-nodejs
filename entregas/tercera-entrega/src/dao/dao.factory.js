import {PERSISTENCE} from "../config/config.js";

import ProductsFileSystemDAO from "./fileSystem/dao/products.DAO.js";
import UsersFileSystemDAO from "./fileSystem/dao/users.DAO.js";
import CartsFileSystemDAO from "./fileSystem/dao/carts.DAO.js";
import TicketsFileSystemDAO from "./fileSystem/dao/tickets.DAO.js";
import MessagesFileSystemDAO from "./fileSystem/dao/messages.DAO.js";

import ProductsMongoDAO from "./mongo/dao/products.DAO.js";
import UsersMongoDAO from "./mongo/dao/users.DAO.js";
import CartsMongoDAO from "./mongo/dao/carts.DAO.js";
import TicketsMongoDAO from "./mongo/dao/tickets.DAO.js";
import MessagesMongoDAO from "./mongo/dao/messages.DAO.js";

import ProductsMongooseDAO from "./mongoose/dao/products.DAO.js";
import UsersMongooseDAO from "./mongoose/dao/users.DAO.js";
import CartsMongooseDAO from "./mongoose/dao/carts.DAO.js";
import TicketsMongooseDAO from "./mongoose/dao/tickets.DAO.js";
import MessagesMongooseDAO from "./mongoose/dao/messages.DAO.js";


export function  getPersistence() {
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
            case "MONGOOSE": {
                ProductsDAO  = new ProductsMongooseDAO();
                UsersDAO = new UsersMongooseDAO();
                CartsDAO = new CartsMongooseDAO();
                TicketsDAO = new TicketsMongooseDAO();
                MessagesDAO = new MessagesMongooseDAO();   
                break;
            }
            case "FILESYSTEM": {
                ProductsDAO  = new ProductsFileSystemDAO(productsFilePath);
                UsersDAO = new UsersFileSystemDAO(usersFilePath);
                CartsDAO = new CartsFileSystemDAO(carstFilePath);
                TicketsDAO = new TicketsFileSystemDAO(ticketsFilePath);
                MessagesDAO = new MessagesFileSystemDAO(messagesFilePath);   
                break;
            }
            case "MONGO": {
                ProductsDAO  = new ProductsMongoDAO();
                UsersDAO = new UsersMongoDAO();
                CartsDAO = new CartsMongoDAO();
                TicketsDAO = new TicketsMongoDAO();
                MessagesDAO = new MessagesMongoDAO();   
            
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

