const objects = [
    {
        manzanas: 3,
        peras: 2,
        carne: 1,
        jugos: 5,
        dulces: 2
    },
    {
        manzanas: 1,
        sandias: 1,
        huevos: 6,
        jugos: 1,
        panes: 4
    }
]

let newArray = [];
let total = 0;

objects.forEach(product => {
    const keys = Object.keys(product);
    const values = Object.values(product);

    total += values.reduce((valorInicial, valorAcumulado) => valorAcumulado + valorInicial);

    keys.forEach(key => {
        if (!newArray.includes(key)) newArray.push(key);
    })
})

console.log('Nuevo arreglo de productos: \n', newArray);
console.log('Total de productos: \n', total);