function getArray(arreglo) {
    if (arreglo.length === 0) {
        console.log('lista vacía');
        return;
    }
    arreglo.forEach(element => {
        console.log(element);
    });
    console.log(`Longitud de la lista ${arreglo.length}`);
}

getArray([1, 2, 56, 4, 3]);