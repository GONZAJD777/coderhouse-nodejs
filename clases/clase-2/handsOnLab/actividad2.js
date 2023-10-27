const sumar = (numero1, numero2) => numero1 + numero2;
const restar = (numero1, numero2) => numero1 - numero2;
const multiplicar = (numero1, numero2) => numero1 * numero2;
const dividir = (numero1, numero2) => numero1 / numero2;
const volume = (numero1, numero2) => multiplicar(numero1, numero2) * multiplicar(numero1, numero2);

const executeOperation = (numero1, numero2, callback) => console.log(callback(numero1, numero2, callback));


executeOperation(2, 14, sumar);
executeOperation(2, 14, restar);
executeOperation(2, 14, multiplicar);
executeOperation(2, 14, dividir);
executeOperation(2, 2, volume);