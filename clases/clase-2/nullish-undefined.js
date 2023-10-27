/*
let a = 0;
let b = "Hola";
let result = a || b;
console.log(result); // Salida: "Hola"
El operador || devuelve el valor de la derecha si el valor de la izquierda es 0, false, null, undefined,
una cadena vacía "", o NaN.

let a = 0;
let b = "Hola";
let result = a ?? b;
console.log(result); // Salida: 0
El operador ?? no devuelve el valor de la derecha si el valor de la izquierda es 0, false, o una cadena vacía "".
*/
console.log('** Valor Real **')
let a = 10;
let b = 20;
let test1 = a || b
let test2 = a ?? b
console.log(test1);
console.log(test2);

console.log('** Undefined **')
const varUndefined = undefined;
test1 = varUndefined || 'sin valor'
test2 = varUndefined ?? 'sin valor'
console.log(test1);
console.log(test2);

console.log('** Null **')
const varNull = null;
test1 = varNull || 'sin valor'
test2 = varNull ?? 'sin valor'
console.log(test1);
console.log(test2);

console.log('** Zero **')
const zero = 0;
test1 = zero || 'sin valor'
test2 = zero ?? 'sin valor'
console.log(test1);
console.log(test2);

console.log('** False **')
const varFalse = false;
test1 = varFalse || 'sin valor'
test2 = varFalse ?? 'sin valor'
console.log(test1);
console.log(test2);

console.log('** String **')
const emptyString = "";
test1 = emptyString || 'sin valor'
test2 = emptyString ?? 'sin valor'
console.log(test1);
console.log(test2);