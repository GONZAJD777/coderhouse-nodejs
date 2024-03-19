import { CKE_SCT, CNX_STR, PORT,MODE,PERSISTENCE } from "../src/config/config.js";
import {logger} from "../src/config/logger.config.js";
import * as chai from "chai";
import supertest from "supertest";
import UsersManager from "../src/services/users.manager.js";
import CartsManager from "../src/services/carts.manager.js";



const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const um = new UsersManager();
const cm = new CartsManager();

    describe('Testing Modulo de Sessions',()=>{
        describe('Registrar Usuario',()=>{
           
            let result={};
            before (async () => {
                try {
                    const user = await um.getBy({email:"testuser@gmail.com"});
                    await um.deleteOne({email:"testuser@gmail.com"});
                    await cm.deleteOneCart({_id:user.cart});
                }catch {
                    logger.log('debug','Se intenta eliminar el usuario de Test para evitar errores')
                }
                const testUser = {
                    firstName: "Test",
                    lastName: "User",
                    email: "testuser@gmail.com",
                    password: "123456789",
                    age: 123
                }
                result = await requester.post('/api/sessions/register').send(testUser);
            })
            describe('El endpoint POST /api/sessions/register debe crear un usuario', ()=>{
                
                it('Si se creo el usuario, deberia devolver codigo 201', ()=> {expect(result.statusCode).to.be.equal(201)})
                it('Si se creo el usuario, se deberia retornar el Token en las cookies', ()=> {expect(result.header['set-cookie'][0]).to.exist})
                it('Si se creo el usuario, se debe crear un carrito y asignarselo al usuario', ()=> {expect(result.body.user.cart).to.not.be.equal(undefined)})

            })
        })    


        describe('Login de Usuario',()=>{
            let result={};

            before (async () => {
                const testUser = {
                    email: "testuser@gmail.com",
                    password: "123456789"
                }
                result = await requester.post('/api/sessions/login').send(testUser);
            })
            describe('El endpoint POST /api/sessions/login debe devolver el token', async()=>{
            
                it('Si se Logeo el usuario, deberia devolver codigo 200', ()=> {expect(result.statusCode).to.be.equal(200)})
                it('Si se Logeo el usuario, se deberia retornar el Token en las cookies', ()=> {expect(result.header['set-cookie'][0]).to.exist})
            })
        })    

        describe('Verificar Usuario logeado',()=>{
            let result={};
            before (async () => {
                const testUser = {
                    email: "testuser@gmail.com",
                    password: "123456789"
                }
                result = await requester.post('/api/sessions/login').send(testUser);
                const token = result.header['set-cookie'][0]

                result = await requester.get('/api/sessions/current')
                                        .set('Cookie',token);
            })
            describe('El endpoint GET /api/sessions/current debe devolver el usuario logeado', async()=>{
            
                it('Si el token es valido, deberia devolver codigo 200', ()=> {expect(result.statusCode).to.be.equal(200)})
                it('Si se token es valido, deberia devolver la informacion del usuario', ()=> {expect(result.body.payload).to.not.be.equal(undefined)})
            })
            after (async () => { 
                await um.deleteOne({email:result.body.payload.email}); 
                await cm.deleteOneCart({_id:result.body.payload.cart});
            })
        })

        
            //logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + result.statusCode);
            //logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + result.ok);
            //logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + JSON.stringify(result.body));
            //logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + result.header['set-cookie'][0]);
        
    })
