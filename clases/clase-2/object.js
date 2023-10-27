const objeto1 = {
    impuesto1: 12,
    impuesto2: 42,
    impuesto3: 35
};

//Keys: devuelve las claves : impuesto
const soloPropiedades = Object.keys(objeto1);
console.log(soloPropiedades);

//entries: nos devuelve valores y propiedades
const entradas = Object.entries(objeto1);
console.log(entradas);

// Values: devuelve solo los valores del objeto
const soloValores = Object.values(objeto1);
console.log(soloValores);
