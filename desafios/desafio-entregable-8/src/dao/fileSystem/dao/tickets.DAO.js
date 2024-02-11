import fs from 'fs/promises'
import Ticket from '../models/ticket.js'

export default class TicketsFileSystemDAO {
 
  // path se pasa como parametro al ser instanciada en el factory  
  constructor(path) {
    this.path = path
  }

  async #readTickets() {
    return JSON.parse(await fs.readFile(this.path, 'utf-8'))
  }

  async #writeTickets(tickets) {
    await fs.writeFile(this.path, JSON.stringify(tickets, null, 2))
  }

  async matches(query) {
    return function (elem) {
      for (const key in query) {
        if (!elem.hasOwnProperty(key) || elem[key] !== query[key]) {
          return false
        }
      }
      return true
    }
  }
  
  async toPOJO(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  async create(data) {
    const ticket = new Ticket(data)                       //se crea el nuevo objeto en memoria
    const ticketPojo = ticket.toPOJO();                   //obtengo el POJO del objeto creado
    const tickets = await this.#readTickets()             //levanto todos los objetos en el archivo en memoria
    tickets.push(ticketPojo)                              // pusheamos el POJO del nuevo objeto dentro del array de objetos
    await this.#writeTickets(tickets)                     // reescribimos el archivo con el nuevo array. Pisando los datos viejos
    return ticketPojo                                      // retornamos el POJO del objeto creado para devolverlo al front
  }

  async readOne(query) {
    const tickets = await this.#readTickets()             //levanto todos los objetos en el archivo en memoria 
    const buscado = tickets.find(matches(query))           //buscamos el elemento que cumple el criterio de busqueda (query)
    return buscado                                          //retornamos el POJO del objeto encontrado para devolverlo al front
  }

  async readMany(query) {
    const tickets = await this.#readTickets()             //levanto todos los objetos en el archivo en memoria 
    const buscados = tickets.filter(matches(query))        //buscamos los elementos que cumplen el criterio de busqueda (query)
    return buscados                                         //retornamos el POJO de objetos encontrados para devolverlo al front
  }

  async updateOne(query, data) {
    const tickets = await this.#readTickets()             //levanto todos los objetos en el archivo en memoria
    const indexBuscado = tickets.findIndex(matches(query)) //buscamos el index del elemento que cumple el criterio de busqueda (query)
    if (indexBuscado !== -1) {                              //se verifica que sea distinto de -1 (ningun elemento cumple el criterio)
      const nuevo = {                                       //reemplazamos los campos del objeto encontrado con los nuevos valores enviados como parametro
        ...tickets[indexBuscado],
        ...data
      }
      tickets[indexBuscado] = nuevo                        //reemplazamos el objeto modificado en el array de productos con el nuevo objeto modificado
      await this.#writeTickets(tickets)                   //reescribimos el archivo con el nuevo array de productos
      return nuevo                                          //retornamos el objeto modificado (con los cambios, no el viejo objeto)
    }
    return null
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