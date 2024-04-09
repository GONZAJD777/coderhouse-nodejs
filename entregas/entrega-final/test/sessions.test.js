import { CKE_SCT, CNX_STR, PORT,MODE,PERSISTENCE,TU1_USER,TU2_USER } from "../src/config/config.js";
import {logger} from "../src/config/logger.config.js";
import * as chai from "chai";
import supertest from "supertest";
import UsersManager from "../src/services/users.manager.js";
import CartsManager from "../src/services/carts.manager.js";
import UserDTO from "../src/dao/dto/users.DTO.js";


const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const um = new UsersManager();
const cm = new CartsManager();

    describe('Testing Modulo de Sessions',()=>{
        describe('Registrar Usuario',()=>{
           
            let result={};
            before (async () => {
                try {
                    await um.getBy(UserDTO.build({email:TU1_USER.email}));
                    await um.deleteOne(UserDTO.build({email:TU1_USER.email}));
                }catch {
                    logger.log('debug','Se intenta eliminar el usuario de Test para evitar errores')
                }
                const testUser = {...TU1_USER}
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
                const testUserCredentials = {
                    email: TU1_USER.email,
                    password: TU1_USER.password
                }
                result = await requester.post('/api/sessions/login').send(testUserCredentials);
            })
            describe('El endpoint POST /api/sessions/login debe devolver el token', async()=>{
            
                it('Si se Logeo el usuario, deberia devolver codigo 200', ()=> {expect(result.statusCode).to.be.equal(200)})
                it('Si se Logeo el usuario, se deberia retornar el Token en las cookies', ()=> {expect(result.header['set-cookie'][0]).to.exist})
            })
        })    

        describe('Verificar Usuario logeado',()=>{
            let result={};
            before (async () => {
                const testUserCredentials = {
                    email: TU1_USER.email,
                    password: TU1_USER.password
                }
                result = await requester.post('/api/sessions/login').send(testUserCredentials);
                const token = result.header['set-cookie'][0]

                result = await requester.get('/api/sessions/current')
                                        .set('Cookie',token);
            })
            describe('El endpoint GET /api/sessions/current debe devolver el usuario logeado', async()=>{
            
                it('Si el token es valido, deberia devolver codigo 200', ()=> {expect(result.statusCode).to.be.equal(200)})
                it('Si el token es valido, deberia devolver la informacion del usuario', ()=> {expect(result.body.payload).to.not.be.equal(undefined)})
            })
            after (async () => { 
                await um.deleteOne(UserDTO.build({email:result.body.payload.email}));
            })
        })

        
            //logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + result.statusCode);
            //logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + result.ok);
            //logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + JSON.stringify(result.body));
            //logger.log ('debug',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' + result.header['set-cookie'][0]);
        
    })
