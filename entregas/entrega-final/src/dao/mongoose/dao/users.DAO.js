import userModel from '../models/user.js'

export default class UsersMongooseDAO {

//**** INSERT *****//
//✓ db.collection.insertOne(doc) : Agrega un nuevo documento a la colección seleccionada.
//✓ db.collection.insertMany(docs): Agrega múltiples documentos a la colección seleccionada (dado un arreglo de documentos).
  async create(data) {
    const user = await userModel.create(data);
    return user;
  }
  
//**************************************************************************************************//

//**** SELECT *****//
//✓ db.collection.findOne(opt): Busca un elemento que cumpla con los criterios de búsqueda (opt), devuelve el primer documento que cumpla con dicho criterio.
//✓ db.collection.find(opt):Devuelve todos los documentos que cumplan con dicho criterio. 
//✓ db.collection.find(opt).pretty(): Añadido para hacer más presentables los resultados de un find().
  async readOne(query) {
    const user = await userModel.findOne(query).lean();
    return user;
  }

  async readMany(query) {
    const users = await userModel.find(query).lean();
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

  async updateOne(query, data) {   
    const update = {$set:data};
    let newUser = await userModel.updateOne(query,update);
    if(newUser.matchedCount===0){newUser=undefined}
    else {newUser=await userModel.findOne(query)}
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
  async deleteOne(query) {
    const result = await userModel.deleteOne(query);
    return result;
  }

//db.collection.deleteMany({key:val}) : Elimina todos los documentos que cumplan con el criterio, se usa 
//cuando sabemos que más de un valor va a contar con ese valor y necesitamos hacer una limpieza general.
  async deleteMany(query) {
    const result = await userModel.deleteMany(query);
    return result;
  }
//**************************************************************************************************//

}