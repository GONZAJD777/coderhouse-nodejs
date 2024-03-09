import Product from '../models/product.js'
import {dbProducts} from  '../../../config/mongoDB.config.js'
import { ObjectId } from 'mongodb';

export default class ProductsMongoDAO {

//**** INSERT *****//
//✓ db.collection.insertOne(doc) : Agrega un nuevo documento a la colección seleccionada.
//✓ db.collection.insertMany(docs): Agrega múltiples documentos a la colección seleccionada (dado un arreglo de documentos).
  async create(data) {
    const product = new Product(data);
    const insProduct = await dbProducts.insertOne(product.getProductPOJO());
    product._id=insProduct.insertedId;
    return product.getProductPOJO();
  }
//**************************************************************************************************//

//**** SELECT *****//
//✓ db.collection.findOne(opt): Busca un elemento que cumpla con los criterios de búsqueda (opt), devuelve el primer documento que cumpla con dicho criterio.
//✓ db.collection.find(opt):Devuelve todos los documentos que cumplan con dicho criterio. 
//✓ db.collection.find(opt).pretty(): Añadido para hacer más presentables los resultados de un find().
  async readOne(query) {
    if(query._id){query._id=new ObjectId(query._id)}
    const product = await dbProducts.findOne(query);
    return product;
  }

  async readMany(query) {
    const products = await dbProducts.find(query).toArray();
    return products;
  }
//**************************************************************************************************//

//**** UPDATE *****//
//db.collection.updateOne(query,update,option)  
//✓ query: sirve para filtrar qué elementos actualizar (usa los filtros iguales al find)
//✓ update: Apartado para indicar qué actualizar de los documentos que cumplen con el filtro. 
//          Update tiene sus propios operadores como $set, $unset, $inc,$rename, $mul, $min, $max
//✓ option: Opciones a tomar en cuenta para la  actualización (como upsert, que inserta el valor en 
//caso de que el documento a actualizar ni siquiera exista).

  async updateOne(query, data) {    
    const update = {$set:data};
    if(query._id){query._id=new ObjectId(query._id)}
    let newProduct = await dbProducts.updateOne(query,update);
    if(newProduct.matchedCount===0){newProduct=undefined}
    else {newProduct=await dbProducts.findOne(query)}
    return newProduct;
  }

//db.collection.updateMany(query,update,options) Actualiza múltiples documentos que cumplan con el criterio.
  async updateMany(query, data) {
    throw new Error('NOT IMPLEMENTED')
  }
//**************************************************************************************************//

//**** DELETE *****//
//db.collection.deleteOne({key:val}) : Elimina sólo el primer elemento que cumpla con el criterio, se usa 
//principalmente para encontrar identificadores específicos. Se recomienda no utilizar si somos 
//conscientes de que el valor a buscar no es repetido.
  async deleteOne(query) {
    if(query._id){query._id=new ObjectId(query._id)}
    let delProduct = await dbProducts.deleteOne(query);
    if(delProduct.deletedCount===0){delProduct=undefined}
    else {delProduct=await dbProducts.findOne(query)}
    return delProduct;
  }

//db.collection.deleteMany({key:val}) : Elimina todos los documentos que cumplan con el criterio, se usa 
//cuando sabemos que más de un valor va a contar con ese valor y necesitamos hacer una limpieza general.
  async deleteMany(query) {
    throw new Error('NOT IMPLEMENTED')
  }
//**************************************************************************************************//

}