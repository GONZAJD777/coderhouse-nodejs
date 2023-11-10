class Product {

    static id=0;          
    constructor(pTitle, pDescription, pPrice, pThumbnail, pCode, pStock) {
        this.id = ++Product.id;
        this.title = this.isEmpty(pTitle,'Titulo');                    
        this.description = this.isEmpty(pDescription,'Descripcion');        
        this.thumbnail = this.isEmpty(pThumbnail,'Thumbnail');            
        this.code = this.isEmpty(pCode,'Codigo');                      
        this.stock = this.isNumberPositive(pStock,'Stock');                   
        this.price = this.isNumberPositive(pPrice,'Precio');   
    }
    

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
              id: this.id,
              title: this.title,                  
              description: this.description,        
              thumbnail: this.thumbnail,          
              code: this.code,                     
              stock: this.stock,                   
              price: this.price
              }
      }

      toString () {
        return {
            id: this.id,
            title: this.title,                  
            description: this.description,        
            thumbnail: this.thumbnail,          
            code: this.code,                     
            stock: this.stock,                   
            price: this.price
            }
      }


}

export default Product;
