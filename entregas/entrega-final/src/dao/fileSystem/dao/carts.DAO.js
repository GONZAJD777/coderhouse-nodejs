import fs from 'fs/promises';
import { __dirname } from '../../../utils.js';
import {matches} from '../../dao.utils.js';
import {Cart,CartDetail} from '../models/cart.js';

export default class CartsFileSystemDAO {
 
  // path se pasa como parametro al ser instanciada en el factory  
  constructor(path) {
    this.path = __dirname + path
    this.#createFile();
  }

  async #createFile() {
    if (await fs.access(this.path, fs.constants.F_OK)) await fs.writeFile(this.path, JSON.stringify([]), 'utf8');
  }
  async #readCarts() {
    return JSON.parse(await fs.readFile(this.path, 'utf-8'))
  }

  async #writeCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2))
  }

   async create(data) {
    const cart = new Cart(data)                       //se crea el nuevo objeto en memoria
    const cartPojo = cart.getCartPOJO();                   //obtengo el POJO del objeto creado
    const carts = await this.#readCarts()             //levanto todos los objetos en el archivo en memoria
    carts.push(cartPojo)                              // pusheamos el POJO del nuevo objeto dentro del array de objetos
    await this.#writeCarts(carts)                     // reescribimos el archivo con el nuevo array. Pisando los datos viejos
    return cartPojo                                      // retornamos el POJO del objeto creado para devolverlo al front
  }

  async readOne(query) {
    const carts = await this.#readCarts()             //levanto todos los objetos en el archivo en memoria 
    const buscado = carts.find(matches(query))           //buscamos el elemento que cumple el criterio de busqueda (query)
    return buscado                                          //retornamos el POJO del objeto encontrado para devolverlo al front
  }



  async readMany(query) {
    const carts = await this.#readCarts()             //levanto todos los objetos en el archivo en memoria 
    const buscados = carts.filter(matches(query))        //buscamos los elementos que cumplen el criterio de busqueda (query)
    return buscados                                         //retornamos el POJO de objetos encontrados para devolverlo al front
  }

  async updateOne(query, data) {
    const carts = await this.#readCarts()             //levanto todos los objetos en el archivo en memoria
    const indexBuscado = carts.findIndex(matches(query)) //buscamos el index del elemento que cumple el criterio de busqueda (query)
    if (indexBuscado !== -1) {                              //se verifica que sea distinto de -1 (ningun elemento cumple el criterio)
      const nuevo = {                                       //reemplazamos los campos del objeto encontrado con los nuevos valores enviados como parametro
        ...carts[indexBuscado],
        ...data
      }
      carts[indexBuscado] = nuevo                        //reemplazamos el objeto modificado en el array de productos con el nuevo objeto modificado
      await this.#writeCarts(carts)                   //reescribimos el archivo con el nuevo array de productos
      return nuevo                                          //retornamos el objeto modificado (con los cambios, no el viejo objeto)
    }
    return null
  }

  async updateMany(query, data) {
    throw new Error('NOT IMPLEMENTED')
  }

  async deleteOne(query) {
    try{
    const carts = await this.#readCarts()             //levantamos todos los productos del archivo
    const indexBuscado = carts.findIndex(matches(query)) //buscamos el index del elemento que cumple el criterio de busqueda (query)
    if (indexBuscado !== -1) {                              //se verifica que sea distinto de -1 (ningun elemento cumple el criterio)
      const [buscado] = carts.splice(indexBuscado, 1)    //eliminamos el index encontrado del array  de productos
      await this.#writeCarts(carts)                   //reescribimos el archivo de productos con el nuevo array de productos
      return buscado                                        //devolvemos el elemento eliminado, si es que algun elemento cumplio el criterio (query)
    }   
    return null   
  }catch (e){
    console.log(e);
  }                                          //devolvemos null si ningun elemento cumple el criterio (index = -1)
  }

  async deleteMany(query) {
    throw new Error('NOT IMPLEMENTED')
  }

  



}