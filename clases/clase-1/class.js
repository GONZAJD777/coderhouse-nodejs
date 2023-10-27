class Persona {
    #cuit;
    constructor(nombre, cuit) {
        this.nombre = nombre;
        this.#cuit = cuit;
    }

    static especie = 'Humano';
    obtenerEspecie = () => {
        console.log(`Soy ${Persona.especie}`);
    }

    saludar = () => {
        console.log(`Hola soy ${this.nombre}`)
    }

    getCuit = () => {
        console.log(this.#cuit);
    }
}

//creo las instancias
const persona1 = new Persona('Martin', '20-1231231-4');
const persona2 = new Persona('Caro', '27-1231312-4');


//instancio las instancias
console.log('Persona 1');
persona1.saludar();
persona1.obtenerEspecie();
persona1.getCuit();
persona1.nombre = 'Martiiiin';
persona1.saludar();
console.log('Persona 2');
persona2.saludar();
persona2.obtenerEspecie();
persona2.getCuit();