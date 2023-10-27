class Contador {
    constructor(responsable) {
        this.responsable = responsable;
        this.conteo = 0;
    }

    static contadorGlobal = 0;

    obtenerResponsable = () => {
        return this.responsable;
    };

    contar = () => {
        this.conteo++;
        Contador.contadorGlobal++;
    }

    obtenerCuentaIndividual = () => {
        return this.conteo;
    }

    static obtenerCuentaGlobal = () => {
        return Contador.contadorGlobal;
    }
};

const contador1 = new Contador('Alejandro');
contador1.contar();
console.log('Contador 1:', contador1.responsable, ' - cuenta como:', contador1.obtenerCuentaIndividual());
console.log('Cuenta global:', Contador.obtenerCuentaGlobal());

const contador2 = new Contador('Alex');
contador2.contar();
console.log('Contador 2:', contador2.responsable, ' - cuenta como:', contador2.obtenerCuentaIndividual());
console.log('Cuenta global:', Contador.obtenerCuentaGlobal());

const contador3 = new Contador('Federico');
contador3.contar();
console.log('Contador 3:', contador3.responsable, ' - cuenta como:', contador3.obtenerCuentaIndividual());
console.log('Cuenta global:', Contador.obtenerCuentaGlobal());