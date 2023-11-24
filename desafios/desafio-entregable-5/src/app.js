import express from "express";
import handlebars from 'express-handlebars'
import { productsRouter } from "./routers/products.router.js";
import { cartsRouter } from "./routers/carts.router.js"

const app = express();

app.engine('handlebars',handlebars.engine());

app.use(express.urlencoded({extended:true}));
app.use(express.json());
//app.use(express.static);

app.use(productsRouter);
app.use(cartsRouter);

app.listen(8080);