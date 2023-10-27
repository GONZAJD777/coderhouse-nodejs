// funcion array.map devuelve cada elemento y su indice 
const valoresBase = [1, 2, 3, 4, 5];
const nuevosValores = valoresBase.map((numero, indice) => numero ** indice)
console.log(nuevosValores);