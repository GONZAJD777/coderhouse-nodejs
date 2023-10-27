let a = 'Luciana';
let b = 'Gala';

console.log('*** let ****');
console.log('Before');
console.log('a:', a);
console.log('b:', b);

a = b;

console.log('After');
console.log('a:', a);
console.log('b:', b);

//Paso por valor: ocupan diferentes espacios de memoria
const c = 'Luciana';
const d = 'Gala';

console.log('*** const ****');
console.log('Before');
console.log('c:', c);
console.log('d:', d);

try {
    c = d;
} catch (error) {
    console.log('No se puede asignar la constante d a c:', error.message);
}

console.log('After');
console.log('c:', c);
console.log('d:', d);