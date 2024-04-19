import User from '../models/user.js'
import {dbUsers} from  '../../../config/mongoDB.config.js'
import { ObjectId } from 'mongodb';

export default class UsersMongoDAO {

//**** INSERT *****//
//✓ db.collection.insertOne(doc) : Agrega un nuevo documento a la colección seleccionada.
//✓ db.collection.insertMany(docs): Agrega múltiples documentos a la colección seleccionada (dado un arreglo de documentos).
  async create(userDTO) {
    const user = new User(userDTO);
    const insUser = await dbUsers.insertOne(user.getUserPOJO());
    user._id=insUser.insertedId;
    return user.getUserPOJO();
  }
//**************************************************************************************************//

//**** SELECT *****//
//✓ db.collection.findOne(opt): Busca un elemento que cumpla con los criterios de búsqueda (opt), devuelve el primer documento que cumpla con dicho criterio.
//✓ db.collection.find(opt):Devuelve todos los documentos que cumplan con dicho criterio. 
//✓ db.collection.find(opt).pretty(): Añadido para hacer más presentables los resultados de un find().
  async readOne(userDTO) {
    if(userDTO._id){userDTO._id=new ObjectId(userDTO._id)}
    if(userDTO.cart){userDTO.cart=new ObjectId(userDTO.cart)}
    const user = await dbUsers.findOne(userDTO);
    return user;
  }

  async readMany(query) {
    const users = await dbUsers.find(query).toArray();
    return users;
  }
//**************************************************************************************************//


//**** UPDATE *****//
//db.collection.updateOne(query,update,option)  
//✓ query: sirve para filtrar qué elementos actualizar (usa los filtros iguales al find)
//✓ update: Apartado para indicar qué actualizar de los documentos que cumplen con el filtro. 
//          Update tiene sus propios operadores como $set, $unset, $inc,$rename, $mul, $min, $max
//✓ option: Opciones a tomar en cuenta para la  actualización (como upsert, que inserta el valor en 
//caso de que el documento a actualizar ni siquiera exista).

  async updateOne(userDTO) {    
    const update = {$set:{...userDTO}};
    delete update.$set['_id'];
    if(userDTO._id){userDTO._id=new ObjectId(userDTO._id)}
    let newUser = await dbUsers.updateOne({_id:userDTO._id},update);
    if(newUser.modifiedCount===0){newUser=undefined}
    else {newUser=await dbUsers.findOne({_id:userDTO._id})}
    return newUser;
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
  async deleteOne(userDTO) {
    if(userDTO._id){userDTO._id=new ObjectId(userDTO._id)}
    const deletedUser= await dbUsers.findOne(userDTO);
    const result = await dbUsers.deleteOne(userDTO);
    if (result.deletedCount>0){return deletedUser;}
    return undefined;
  }

//db.collection.deleteMany({key:val}) : Elimina todos los documentos que cumplan con el criterio, se usa 
//cuando sabemos que más de un valor va a contar con ese valor y necesitamos hacer una limpieza general.
  async deleteMany(query) {
    if(query._id){query._id=new ObjectId(query._id)}
    const deletedUsers= await dbUsers.find(query).toArray()
    const result = await dbUsers.deleteMany(query);
    if (result.deletedCount>0){return deletedUsers;}
    return undefined
  }
//**************************************************************************************************//

}