import { CustomError, NotFoundError } from './custom.error.js';

class Product {

    static id=0;          
    constructor(pId,pTitle,pDescription,pThumbnail,pStatus,pCategory,pCode,pStock,pPrice) {
        this.id = pId ?? ++Product.id;
        this.title = this.isEmpty(pTitle,'Titulo');                    
        this.description = this.isEmpty(pDescription,'Descripcion');        
        this.thumbnail= this.splitThumbnails(pThumbnail+''); 
        this.status = this.isBoolean(pStatus);           
        this.category=this.isEmpty(pCategory,'Category'); 
        this.code = this.isEmpty(pCode,'Codigo');                      
        this.stock = this.isNumberPositive(pStock,'Stock');                   
        this.price = this.isNumberPositive(pPrice,'Precio');   
    }
    
    splitThumbnails(value){
        if ((value===undefined) || value=='undefined' || value.trim().length == 0) {
            return []
        }else
        {
            const retorno = value.toString();
            return retorno.split(",");
        }
        
    }

    isBoolean (value){
        if (value===true || value ===false)
        {
            return value
        }else
        {
            const value=true;
            return value
        }
    }

    isNumberPositive(value,etiqueta) {
            if((!isNaN(value)) && value >= 0){
                return Number(value)
            }
            else {
                throw new CustomError(500003, 'El valor ingresado es inválido. Ingrese solo valores numéricos mayores o iguales a 0 en --> '+ etiqueta);
            }
          }
    isEmpty(value,etiqueta) {
        if (!(value===undefined) && value.trim().length != 0){
            return value
        }
        else {
            throw new CustomError(500004,'El valor introducido es inválido en --> '+ etiqueta )
        }
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
