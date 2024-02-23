import { randomUUID } from 'node:crypto'
import { CustomError, NotFoundError } from '../../../errors/custom.error.js';

class Product {

    #_id;
    #title;                    
    #description;        
    #thumbnail; 
    #status;           
    #category; 
    #code;
    #stock;                      
    #price;
        
    constructor({id,title,description,thumbnail,status,category,code,stock,price}) {
        this.#_id = id ;
        this.#title = this.isEmpty(title,'Titulo');                    
        this.#description = this.isEmpty(description,'Descripcion');        
        this.#thumbnail= this.splitThumbnails(thumbnail+''); 
        this.#status = this.isBoolean(status);           
        this.#category=this.isEmpty(category,'Categoria'); 
        this.#code = this.isEmpty(code,'Codigo');                      
        this.#stock = this.isNumberPositive(stock,'Stock');                   
        this.#price = this.isNumberPositive(price,'Precio');   
    }
    
    get _id() { return this.#_id }
    get title() { return this.#title }
    get description() { return this.#description }
    get thumbnail() { return this.#thumbnail }
    get status() { return this.#status }
    get category() { return this.#category }
    get code() { return this.#code }
    get stock() { return this.#stock }
    get price() { return this.#price }
    
    set _id(value) {this.#_id = value}
    set title(value) {this.#title = this.isEmpty(value,'Titulo')}
    set description(value) {this.#description = this.isEmpty(value,'Descripcion')}
    set thumbnail(value) {this.#thumbnail = this.splitThumbnails(value+'');}
    set status(value) {this.#status = this.isBoolean(value)}
    set category(value) {this.#category = this.isEmpty(value,'Categoria')}
    set code(value) {this.#code = this.isEmpty(value,'Codigo')}
    set stock(value) {this.#stock = this.isNumberPositive(value,'Stock')}
    set price(value) {this.#price = this.isNumberPositive(value,'Precio')}

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

    getProductPOJO (){ //Plain Old Javascript Object
          return {
                    _id : this._id,
                    title : this.title,                    
                    description: this.description,       
                    thumbnail: this.thumbnail,
                    status : this.status,       
                    category : this.category, 
                    code : this.code,                    
                    stock : this.stock,                   
                    price : this.price   
                }
    }
}

export default Product;
