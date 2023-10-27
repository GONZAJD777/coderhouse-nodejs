const objeto1 = {
    propiedad1: 2,
    propiedad2: 'b',
    propiedad3: true
};

const objeto2 = {
    propiedad4: 'c',
    propiedad5: [1, 2, 3, 4]
};


//Spread: Uno varios objetos.
const objetoResultante = {
    ...objeto1, ...objeto2
}
console.log(objetoResultante);

//Rest operator: Separo elementos de un objeto.
const objeto3 = {
    a: 1,
    b: 2,
    c: 3
}
const { a, ...rest } = objeto3;
console.log(a);
console.log(rest);