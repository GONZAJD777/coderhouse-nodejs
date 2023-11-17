import express from "express";
import { productsRouter } from "./routers/products.router.js";
import { cartsRouter } from "./routers/carts.router.js"

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
//app.use(express.static);

app.use(productsRouter);
app.use(cartsRouter);

app.listen(8080);