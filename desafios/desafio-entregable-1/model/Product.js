class Product {

    #id             
    #tittle         //(nombre del producto)
    #description    //(descripción del producto)
    #thumbnail      //(ruta de imagen)
    #code           //(código identificador)
    #price          //(precio)
    #stock          //(número de piezas disponibles)


    constructor (pId,pTittle, pDescription, pPrice, pThumbnail, pCode, pStock) {
        this.#id = this.isNumberPositive(pId,'ID');
        this.#tittle = this.isEmpty(pTittle,'Titulo');                    
        this.#description = this.isEmpty(pDescription,'Descripcion');        
        this.#thumbnail = this.isEmpty(pThumbnail,'Thumbnail');            
        this.#code = this.isEmpty(pCode,'Codigo');                      
        this.#stock = this.isNumberPositive(pStock,'Stock');                   
        this.#price = this.isNumberPositive(pPrice,'Precio');                    

    }

    set id (pId) {this.#id = this.isNumberPositive(pId,'ID')}
    get id () {
        let vId = this.#id
        return vId
    }

    set tittle (pTittle ) {this.#tittle = this.isEmpty(pTittle,'Titulo')}
    get tittle () {
        let vTittle = this.#tittle
        return vTittle}

    set description (pDescription) {this.#description = this.isEmpty(pDescription,'Descripcion')}
    get description () {const vDescription = this.#description
        return vDescription}

    set thumbnail (pThumbnail) {this.#thumbnail = this.isEmpty(pThumbnail,'Thumbnail')}
    get thumbnail () {
        let vThumbnail = this.#thumbnail
        return vThumbnail}

    set code (pCode) {this.#code = this.isEmpty(pCode,'Codigo')}
    get code () {
        let vCode = this.#code
        return vCode = this.#code}

    set price (pPrice){this.#price = this.isNumberPositive(pPrice,'Precio')}
    get price (){
        let vPrice = this.#price
        return vPrice = this.#price}

    set stock (pStock){this.#stock = this.isNumberPositive(pStock,'Stock')}
    get stock (){
        let vStock = this.#stock
        return vStock = this.#stock}

    isNumberPositive(value,etiqueta) {
        if(!isNaN(value) && value >= 0){
            return value
        }
        else {throw new Error ('El valor ingresado es inválido. Ingrese solo valores numéricos mayores o iguales a 0 en --> '+ etiqueta)}
      }
    isEmpty(value,etiqueta) {
        if (value.trim().length != 0){
            return value
        }
        else {throw new Error ('El valor introducido es inválido en --> '+ etiqueta)}
      }
      asPOJO () //Plain Old Javascript Object
      {
          return {
              id: this.#id,
              tittle: this.#tittle,                  
              description: this.#description,        
              thumbnail: this.#thumbnail,          
              code: this.#code,                     
              stock: this.#stock,                   
              price: this.#price
              }
      }


}





module.exports = Product;
