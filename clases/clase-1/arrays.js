//paso por referencia: ocupan el mismo espacio en memoria 
const arrayA = [1, 2, 3];
const arrayB = arrayA;
console.log('Before');
console.log('arrayA:', arrayA);
console.log('arrayB:', arrayB);

arrayB.push(4);

console.log('After');
console.log('arrayA:', arrayA);
console.log('arrayB:', arrayB);