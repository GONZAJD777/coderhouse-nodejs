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

describe('Testing Modulo de Products',()=>{
    describe('Registrar Producto',()=>{
        let createResult={};
        before (async () => {
            try {
                await pm.deleteOneProduct({code:"TEST0001"})
            }catch {
                logger.log('debug','Se intenta eliminar el producto de Test para evitar errores')
            }
            
            const testUser = {
                email: ADMIN_EMAIL,
                password: ADMIN_PASS
            }
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]

            const testProduct = {
                title: "TESTPRODUCT0001",
                description: "Producto de Testing",
                thumbnail: ["https://http2.mlstatic.com/D_Q_NP_934404-MLA72073554361_102023-W.webp"],
                category: "TEST",
                code: "TEST0001",
                stock: 100,
                price: 100
            }

            createResult = await requester.post('/api/products')
                                          .send(testProduct)
                                          .set('Cookie',token);
        })
        describe('El endpoint POST /api/produts debe crear el producto', ()=>{
            
            it('Si se creo el producto, deberia devolver codigo 201', ()=> {expect(createResult.statusCode).to.be.equal(201)})
            it('Si se creo el producto, se deberia retornar el objeto', ()=> {expect(createResult.body.Object).to.exist})


        })
    })    

    describe('Actualizar Producto',()=>{
        let updateResult={};
        before (async () => { 
            const testUser = {
                email: ADMIN_EMAIL,
                password: ADMIN_PASS
            }
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]                                                                   

            const beforeProduct = await pm.getProductByCode("TEST0001");

            const testProduct = {
                title: "TESTPRODUCT0002",
                description: "Producto de Testing despues de actualizacion",
                thumbnail: ["https://http2.mlstatic.com/D_NQ_NP_667643-MLU72628342894_112023-O.webp"],
                category: "UPDTEST",
                stock: 200,
                price: 1000
            }

            updateResult = await requester.put('/api/products/'+beforeProduct._id)
                                          .send(testProduct)
                                          .set('Cookie',token);
        })
        describe('El endpoint PUT /api/produts/:pid debe actualizar el producto', ()=>{
            
            it('Si se actualizo el producto, deberia devolver codigo 200', ()=> {expect(updateResult.statusCode).to.be.equal(200)})
            it('Si se actualizo el producto, se deberia retornar el objeto', ()=> {
                expect(updateResult.body.Object.title).to.be.equal("TESTPRODUCT0002");
                expect(updateResult.body.Object.description).to.be.equal("Producto de Testing despues de actualizacion");
                expect(updateResult.body.Object.category).to.be.equal("UPDTEST");
                expect(updateResult.body.Object.stock).to.be.equal(200);
                expect(updateResult.body.Object.price).to.be.equal(1000);
                expect(updateResult.body.Object.thumbnail[0]).to.be.equal("https://http2.mlstatic.com/D_NQ_NP_667643-MLU72628342894_112023-O.webp");
            })
        })
    })    

    describe('Eliminar Producto',()=>{
        let deleteResult={};
        let getResult;
        before (async () => {            
            const testUser = {
                email: ADMIN_EMAIL,
                password: ADMIN_PASS
            }
            const loginResult = await requester.post('/api/sessions/login').send(testUser);
            const token = loginResult.header['set-cookie'][0]

            const beforeProduct = await pm.getProductByCode("TEST0001");

            deleteResult = await requester.delete('/api/products/'+beforeProduct._id)
                                          .set('Cookie',token);
            getResult = await requester.get('/api/products/'+beforeProduct._id);   
        })
        describe('El endpoint DELETE /api/produts/ debe eliminar el producto', ()=>{
            
            it('Si se elimino el producto, deberia devolver codigo 200', ()=> {expect(deleteResult.statusCode).to.be.equal(200)})
            it('Si se elimino el producto, la consulta del mismo deberia devolver el objeto vacio', ()=> {expect(getResult.body.Object).to.not.exist})
        })
    })
    
})
