import { CKE_SCT, CNX_STR, PORT,MODE,PERSISTENCE,ADMIN_EMAIL,ADMIN_PASS } from "../src/config/config.js";
import {logger} from "../src/config/logger.config.js";
import * as chai from "chai";
import supertest from "supertest";
import UsersManager from "../src/services/users.manager.js";
import CartsManager from "../src/services/carts.manager.js";
import ProductsManager from "../src/services/products.manager.js";



const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const um = new UsersManager();
const cm = new CartsManager();
const pm = new ProductsManager();

describe('Testing Modulo de Carts',()=>{
    let userResult={};
    let productResult1={};
    let productResult2={};
    before (async () => {
        try {
            const user = await um.getBy({email:"carttestuser@gmail.com"});
            await um.deleteOne({email:"carttestuser@gmail.com"});
            await cm.deleteOneCart({_id:user.cart});
            await pm.deleteOneProduct({code:"CARTTEST0001"});
            await pm.deleteOneProduct({code:"CARTTEST0002"});
        }catch {
            logger.log('debug','Se intenta eliminar el usuario de Test para evitar errores')
        }
        const testUser = {
            firstName: "cartTest",
            lastName: "User",
            email: "carttestuser@gmail.com",
            password: "123456789",
            age: 123
        }
        
        const testProduct1 = {
            title: "CARTTESTPRODUCT0001",
            description: "Producto 1 de Testing creado para probar modulo de carrito",
            thumbnail: ["https://http2.mlstatic.com/D_Q_NP_934404-MLA72073554361_102023-W.webp"],
            category: "CARTTEST",
            code: "CARTTEST0001",
            stock: 100,
            price: 100
        }
    const testProduct2 = {
            title: "CARTTESTPRODUCT0002",
            description: "Producto 2 de Testing creado para probar modulo de carrito",
            thumbnail: ["https://http2.mlstatic.com/D_Q_NP_934404-MLA72073554361_102023-W.webp"],
            category: "CARTTEST",
            code: "CARTTEST0002",
            stock: 100,
            price: 100
        }
    userResult = await requester.post('/api/sessions/register').send(testUser)
        productResult1= await pm.addProduct(testProduct1);
        productResult2= await pm.addProduct(testProduct2);
    })
    describe('Agregar Producto al carrito',()=>{
        let AddToCartResult={};
        before (async () => {
            const testUser = {
                email: "carttestuser@gmail.com",
                password: "123456789"
            }
                       
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]
            const currentResult = await requester.get('/api/sessions/current')
                                        .set('Cookie',token);

            AddToCartResult = await requester.post('/api/carts/'+ currentResult.body.payload.cart+'/products/'+productResult1._id)
                                             .set('Cookie',token);

        })
        describe('El endpoint POST /api/carts/:cid/products/:pid debe agregar el producto al carrito', async()=>{
            it('Si se agrego el producto, deberia devolver codigo 200', ()=> {expect(AddToCartResult.statusCode).to.be.equal(200)})
            it('Si se agrego el producto, se debe verificar el objeto en el detalle del carrito', ()=> {expect(AddToCartResult.body.Object.cartDetail[0]).to.exist})
        })
    })       
    describe('Modificar la cantidad del Producto en el carrito',()=>{
        let AddToCartResult={};
        before (async () => {
            const testUser = {
                email: "carttestuser@gmail.com",
                password: "123456789"
            }
                       
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]
            const currentResult = await requester.get('/api/sessions/current')
                                                 .set('Cookie',token);

            const updateCart = {quantity:10}
            AddToCartResult = await requester.put('/api/carts/'+ currentResult.body.payload.cart+'/products/'+productResult1._id)
                                             .send(updateCart)
                                             .set('Cookie',token);
        })
        describe('El endpoint PUT /api/carts/:cid/products/:pid debe actualizar la cantidad del producto el carrito', async()=>{  
            it('Si se actualiza la cantidad del producto, deberia devolver codigo 200', ()=> {expect(AddToCartResult.statusCode).to.be.equal(200)})
            it('Si se actualiza la cantidad del producto, se debe verificar la cantidad del producto en 10', ()=> {expect(AddToCartResult.body.Object.cartDetail[0].quantity).to.be.equal(10)})
        })
    })  
    describe('Eliminar Producto el carrito',()=>{
        let AddToCartResult={};
        before (async () => {
            const testUser = {
                email: "carttestuser@gmail.com",
                password: "123456789"
            }
                       
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]
            const currentResult = await requester.get('/api/sessions/current')
                                                 .set('Cookie',token);

            AddToCartResult = await requester.delete('/api/carts/'+ currentResult.body.payload.cart+'/products/'+productResult1._id)
                                             .set('Cookie',token);
        })
        describe('El endpoint DELETE /api/carts/:cid/products/:pid debe eliminar el producto del carrito', async()=>{  
            it('Si se elimina el producto del carrito, deberia devolver codigo 200', ()=> {expect(AddToCartResult.statusCode).to.be.equal(200)})
            it('Si se elimina el producto del carrito, se debe verificar el carrito vacio', ()=> {expect(AddToCartResult.body.Object.cartDetail.length).to.be.equal(0)})
        })
    }) 
    describe('Modificar detalle del carrito',()=>{
        let AddToCartResult={};
        before (async () => {
            const testUser = {
                email: "carttestuser@gmail.com",
                password: "123456789"
            }
                       
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]
            const currentResult = await requester.get('/api/sessions/current')
                                        .set('Cookie',token);
            const updateCart = [
                {product: productResult1._id,quantity: 101},
                {product: productResult2._id,quantity: 100},
                ]

            AddToCartResult = await requester.put('/api/carts/'+ currentResult.body.payload.cart)
                                             .send(updateCart)
                                             .set('Cookie',token);

        })
        describe('El endpoint PUT /api/carts/:cid debe modificar el detalle del carrito', async()=>{
            it('Si se modifico el detalle del carrito, deberia devolver codigo 200', ()=> {expect(AddToCartResult.statusCode).to.be.equal(200)})
            it('Si se modifico el detalle del carrito, se debe verificar el detalle del carrito con 2 items', ()=> {expect(AddToCartResult.body.Object.cartDetail.length).to.be.equal(2)})
        })
    }) 
    describe('Generar Ticket del carrito',()=>{
        let AddToCartResult={};
        before (async () => {
            const testUser = {
                email: "carttestuser@gmail.com",
                password: "123456789"
            }
                       
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]
            const currentResult = await requester.get('/api/sessions/current')
                                                 .set('Cookie',token);

            AddToCartResult = await requester.post('/api/carts/'+ currentResult.body.payload.cart+'/purchase')
                                             .set('Cookie',token);

        })
        describe('El endpoint POST /api/carts/:cid/purchase debe generar el Ticket y vaciar el carrito si hay stock', async()=>{
            it('Si se genera el ticket, deberia devolver codigo 201', ()=> {expect(AddToCartResult.statusCode).to.be.equal(201)})
            it('Si se genera el ticket, se debe verificar que se devuelva el ticket', ()=> {expect(AddToCartResult.body.Object.ticket).to.exist})
            it('Si se genera el ticket, se debe verificar 1 item en el carrito por no haber suficiente stock', ()=> {expect(AddToCartResult.body.Object.cart.cartDetail.length).to.be.equal(1)})

        })
    }) 
    describe('Elminar detalle del carrito',()=>{
        let AddToCartResult={};
        before (async () => {
            const testUser = {
                email: "carttestuser@gmail.com",
                password: "123456789"
            }
                       
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]
            const currentResult = await requester.get('/api/sessions/current')
                                                 .set('Cookie',token);

            AddToCartResult = await requester.delete('/api/carts/'+ currentResult.body.payload.cart)
                                             .set('Cookie',token);

        })
        describe('El endpoint DELETE /api/carts/:cid debe eliminar todos los productos del carrito', async()=>{
            it('Si se elimino el detalle del carrito, deberia devolver codigo 200', ()=> {expect(AddToCartResult.statusCode).to.be.equal(200)})
            it('Si se elimino el detalle del carrito, se debe verificar el detalle del carrito con 0 items', ()=> {expect(AddToCartResult.body.Object.cartDetail.length).to.be.equal(0)})
        })
    }) 
    after (async () =>{
        const user = await um.getBy({email:"carttestuser@gmail.com"});
                    await um.deleteOne({email:"carttestuser@gmail.com"});
                    await cm.deleteOneCart({_id:user.cart});
                    await pm.deleteOneProduct({code:"CARTTEST0001"});
                    await pm.deleteOneProduct({code:"CARTTEST0002"});
    })
})
