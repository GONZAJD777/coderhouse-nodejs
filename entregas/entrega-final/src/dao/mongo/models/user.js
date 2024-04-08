import { randomUUID } from 'node:crypto'
import { CustomError, NotFoundError } from '../../../errors/custom.error.js';
import { StringToDate } from '../../../utils.js';

class User {
   
    #_id;
    #firstName;                    
    #lastName;        
    #email; 
    #age;           
    #password; 
    #role;                      
    #cart;
    #documents
    //#lastConnection;

    constructor({id,firstName,lastName,email,age,password,role,cart,documents}) {
        this.#_id = id;
        this.#firstName = this.isEmpty(firstName,'FirstName');                    
        this.#lastName = this.isEmpty(lastName,'LastName');        
        this.#email= this.isEmpty(email,'Email');      
        this.#password=this.isEmpty(password,'Password');
        this.#age = this.isNumberPositive(age,'Age');       
        this.#role = role ?? 'user';                      
        this.#cart = cart;
        this.#documents= documents ?? [];
        //this.#lastConnection = lastConnection;

    }                   

    get _id() { return this.#_id }
    get firstName() { return this.#firstName }
    get lastName() { return this.#lastName }
    get email() { return this.#email }
    get password() { return this.#password }
    get age() { return this.#age }
    get role() { return this.#role }
    get cart() { return this.#cart }
    get documents() { return this.#documents }
    //get lastConnection() { return this.#lastConnection }

    
    set _id(value) {this.#_id = value}
    set firstName(value) {this.#firstName = this.isEmpty(value,'FirstName')}
    set lastName(value) {this.#lastName = this.isEmpty(value,'LastName')}
    set email(value) {this.#email = this.isEmpty(value,'Email')}
    set age(value) {this.#age = this.isNumberPositive(value,'Age')}
    set password(value) {this.#password = this.isEmpty(value,'Password')}
    set role(value) {this.#role = this.isEmpty(value,'Role')}
    set cart(value) {this.#cart = this.isEmpty(value,'Cart')}
    set documents(value) {this.#documents = value}
    //set lastConnection(value) {this.#lastConnection = value}

    
        
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

        getUserPOJO (){ //Plain Old Javascript Object
            return {
                        _id : this.#_id,
                        firstName : this.#firstName,                    
                        lastName : this.#lastName, 
                        email : this.#email,  
                        password : this.#password,      
                        age : this.#age,          
                        role : this.#role,                      
                        cart : this.#cart,
                        documents : this.#documents,
                        //lastConnection: this.#lastConnection
                    }
        }
    
}

export default User;