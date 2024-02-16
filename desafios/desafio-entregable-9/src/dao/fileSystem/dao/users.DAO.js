import fs from 'fs/promises'
import { __dirname } from '../../../utils.js';
import {matches} from '../../dao.utils.js'
import User from '../models/user.js'

export default class UsersFileSystemDAO {
 
  // path se pasa como parametro al ser instanciada en el factory  
  constructor(path) {
    this.path = __dirname + path
    this.#createFile();
  }

  async #createFile() {
    if (await fs.access(this.path, fs.constants.F_OK)) await fs.writeFile(this.path, JSON.stringify([]), 'utf8');
  }

  async #readUsers() {
    return JSON.parse(await fs.readFile(this.path, 'utf-8'))
  }

  async #writeUsers(users) {
    await fs.writeFile(this.path, JSON.stringify(users, null, 2))
  }


  async create(data) {
    const user = new User(data)                       //se crea el nuevo objeto en memoria
    const userPojo = user.getUserPOJO();                   //obtengo el POJO del objeto creado
    const users = await this.#readUsers()             //levanto todos los objetos en el archivo en memoria
    users.push(userPojo)                              // pusheamos el POJO del nuevo objeto dentro del array de objetos
    await this.#writeUsers(users)                     // reescribimos el archivo con el nuevo array. Pisando los datos viejos
    return userPojo                                      // retornamos el POJO del objeto creado para devolverlo al front
  }

  async readOne(query) {
    const users = await this.#readUsers()             //levanto todos los objetos en el archivo en memoria 
    const buscado = users.find(matches(query))           //buscamos el elemento que cumple el criterio de busqueda (query)
    return buscado                                          //retornamos el POJO del objeto encontrado para devolverlo al front
  }

  async readMany(query) {
    const users = await this.#readUsers()             //levanto todos los objetos en el archivo en memoria 
    const buscados = users.filter(matches(query))        //buscamos los elementos que cumplen el criterio de busqueda (query)
    return buscados                                         //retornamos el POJO de objetos encontrados para devolverlo al front
  }

  async updateOne(query, data) {
    const users = await this.#readUsers()             //levanto todos los objetos en el archivo en memoria
    const indexBuscado = users.findIndex(matches(query)) //buscamos el index del elemento que cumple el criterio de busqueda (query)
    if (indexBuscado !== -1) {                              //se verifica que sea distinto de -1 (ningun elemento cumple el criterio)
      const nuevo = {                                       //reemplazamos los campos del objeto encontrado con los nuevos valores enviados como parametro
        ...users[indexBuscado],
        ...data
      }
      users[indexBuscado] = nuevo                        //reemplazamos el objeto modificado en el array de productos con el nuevo objeto modificado
      await this.#writeUsers(users)                   //reescribimos el archivo con el nuevo array de productos
      return nuevo                                          //retornamos el objeto modificado (con los cambios, no el viejo objeto)
    }
    return null
  }

  async updateMany(query, data) {
    throw new Error('NOT IMPLEMENTED')
  }

  async deleteOne(query) {
    const users = await this.#readUsers()             //levantamos todos los productos del archivo
    const indexBuscado = users.findIndex(matches(query)) //buscamos el index del elemento que cumple el criterio de busqueda (query)
    if (indexBuscado !== -1) {                              //se verifica que sea distinto de -1 (ningun elemento cumple el criterio)
      const [buscado] = users.splice(indexBuscado, 1)    //eliminamos el index encontrado del array  de productos
      await this.#writeUsers(products)                   //reescribimos el archivo de productos con el nuevo array de productos
      return buscado                                        //devolvemos el elemento eliminado, si es que algun elemento cumplio el criterio (query)
    }   
    return null                                             //devolvemos null si ningun elemento cumple el criterio (index = -1)
  }

  async deleteMany(query) {
    throw new Error('NOT IMPLEMENTED')
  }

  



}