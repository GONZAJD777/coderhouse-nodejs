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
    #owner;
        
    constructor({id,title,description,thumbnail,status,category,code,stock,price,owner}) {
        this.#_id = id || randomUUID();
        this.#title = this.isEmpty(title,'Titulo');                    
        this.#description = this.isEmpty(description,'Descripcion');        
        this.#thumbnail= this.splitDocuments(thumbnail+''); 
        this.#status = this.isBoolean(status);           
        this.#category=this.isEmpty(category,'Categoria'); 
        this.#code = this.isEmpty(code,'Codigo');                      
        this.#stock = this.isNumberPositive(stock,'Stock');                   
        this.#price = this.isNumberPositive(price,'Precio');   
        this.#owner = owner ?? 'admin';

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
    get owner() { return this.#owner }
    
    set title(value) {this.#title = this.isEmpty(value,'Titulo')}
    set description(value) {this.#description = this.isEmpty(value,'Descripcion')}
    set thumbnail(value) {this.#thumbnail = this.splitDocuments(value+'');}
    set status(value) {this.#status = this.isBoolean(value)}
    set category(value) {this.#category = this.isEmpty(value,'Categoria')}
    set code(value) {this.#code = this.isEmpty(value,'Codigo')}
    set stock(value) {this.#stock = this.isNumberPositive(value,'Stock')}
    set price(value) {this.#price = this.isNumberPositive(value,'Precio')}
    set owner(value) {this.#owner = this.isEmpty(value,'Owner')}

    splitDocuments(value){
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
                    price : this.price,
                    owner : this.owner     
                }
    }
}

export default Product;
