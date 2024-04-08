import fs from 'fs/promises'
import { __dirname } from '../../../utils.js';
import {matches} from '../../dao.utils.js'
import Message from '../models/message.js'

export default class MessagesFileSystemDAO {
 
  // path se pasa como parametro al ser instanciada en el factory  
  constructor(path) {
    this.path = __dirname + path
    this.#createFile();
  }

  async #createFile() {
    if (await fs.access(this.path, fs.constants.F_OK)) await fs.writeFile(this.path, JSON.stringify([]), 'utf8');
  }

  async #readMessages() {
    return JSON.parse(await fs.readFile(this.path, 'utf-8'))
  }

  async #writeMessages(messages) {
    await fs.writeFile(this.path, JSON.stringify(messages, null, 2))
  }

  async create(data) {
    const message = new Message(data)                       //se crea el nuevo objeto en memoria
    const messagePojo = message.getMessagePOJO();                   //obtengo el POJO del objeto creado
    const messages = await this.#readMessages()             //levanto todos los objetos en el archivo en memoria
    messages.push(messagePojo)                              // pusheamos el POJO del nuevo objeto dentro del array de objetos
    await this.#writeMessages(messages)                     // reescribimos el archivo con el nuevo array. Pisando los datos viejos
    return messagePojo                                      // retornamos el POJO del objeto creado para devolverlo al front
  }

  async readOne(query) {
    throw new Error('NOT IMPLEMENTED')                                  
  }

  async readMany(query) {
    const messages = await this.#readMessages()             //levanto todos los objetos en el archivo en memoria 
    const buscados = messages.filter(matches(query))        //buscamos los elementos que cumplen el criterio de busqueda (query)
    return buscados                                         //retornamos el POJO de objetos encontrados para devolverlo al front
  }

  async updateOne(query, data) {
    throw new Error('NOT IMPLEMENTED')
  }

  async updateMany(query, data) {
    throw new Error('NOT IMPLEMENTED')
  }

  async deleteOne(query) {
    throw new Error('NOT IMPLEMENTED')                                          
  }

  async deleteMany(query) {
    throw new Error('NOT IMPLEMENTED')
  }

  



}