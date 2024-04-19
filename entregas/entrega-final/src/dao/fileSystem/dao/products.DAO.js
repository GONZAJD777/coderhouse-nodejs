import fs from 'fs/promises'
import { __dirname } from '../../../utils.js';
import {matches} from '../../dao.utils.js';
import Product from '../models/product.js'

export default class ProductsFileSystemDAO {
 
  // path se pasa como parametro al ser instanciada en el factory  
  constructor(path) {
    this.path = __dirname + path
    this.#createFile();
  }

  async #createFile() {
    if (await fs.access(this.path, fs.constants.F_OK)) await fs.writeFile(this.path, JSON.stringify([]), 'utf8');
  }

  async #readProducts() {
    return JSON.parse(await fs.readFile(this.path, 'utf-8'))
  }

  async #writeProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2))
  }

  async create(data) {
    const product = new Product(data)                       //se crea el nuevo objeto en memoria
    const productPojo = product.getProductPOJO();                   //obtengo el POJO del objeto creado
    const products = await this.#readProducts()             //levanto todos los objetos en el archivo en memoria
    products.push(productPojo)                              // pusheamos el POJO del nuevo objeto dentro del array de objetos
    await this.#writeProducts(products)                     // reescribimos el archivo con el nuevo array. Pisando los datos viejos
    return productPojo                                      // retornamos el POJO del objeto creado para devolverlo al front
  }

  async readOne(query) {
    const products = await this.#readProducts()             //levanto todos los objetos en el archivo en memoria 
    const buscado = products.find(matches(query))           //buscamos el elemento que cumple el criterio de busqueda (query)
    return buscado                                          //retornamos el POJO del objeto encontrado para devolverlo al front
  }

  async readMany(query) {
    const products = await this.#readProducts()             //levanto todos los objetos en el archivo en memoria 
    const buscados = products.filter(matches(query))        //buscamos los elementos que cumplen el criterio de busqueda (query)
    return buscados                                         //retornamos el POJO de objetos encontrados para devolverlo al front
  }

  async updateOne(productDTO) {
    const products = await this.#readProducts()             //levanto todos los objetos en el archivo en memoria
    const indexBuscado = products.findIndex(matches({_id:productDTO._id})) //buscamos el index del elemento que cumple el criterio de busqueda (query)
    if (indexBuscado !== -1) {                              //se verifica que sea distinto de -1 (ningun elemento cumple el criterio)
      const nuevo = {                                       //reemplazamos los campos del objeto encontrado con los nuevos valores enviados como parametro
        ...products[indexBuscado],
        ...productDTO
      }
      products[indexBuscado] = nuevo                        //reemplazamos el objeto modificado en el array de productos con el nuevo objeto modificado
      await this.#writeProducts(products)                   //reescribimos el archivo con el nuevo array de productos
      return nuevo                                          //retornamos el objeto modificado (con los cambios, no el viejo objeto)
    }
    return null
  }

  async updateMany(query, data) {
    throw new Error('NOT IMPLEMENTED')
  }

  async deleteOne(productDTO) {
    const products = await this.#readProducts()             //levantamos todos los productos del archivo
    const indexBuscado = products.findIndex(matches({_id:productDTO._id})) //buscamos el index del elemento que cumple el criterio de busqueda (query)
    if (indexBuscado !== -1) {                              //se verifica que sea distinto de -1 (ningun elemento cumple el criterio)
      const [buscado] = products.splice(indexBuscado, 1)    //eliminamos el index encontrado del array  de productos
      await this.#writeProducts(products)                   //reescribimos el archivo de productos con el nuevo array de productos
      return buscado                                        //devolvemos el elemento eliminado, si es que algun elemento cumplio el criterio (query)
    }   
    return null                                             //devolvemos null si ningun elemento cumple el criterio (index = -1)
  }

  async deleteMany(query) {
    throw new Error('NOT IMPLEMENTED')
  }

  



}