const dividir = (dividendo, divisor) => {
    return new Promise((resolve, reject) => {//Genero una nueva promesa, resolve (Ok) y reject (Error)
        if (divisor === 0) {
            reject('No se puede dividir por 0');
        } else {
            resolve(dividendo / divisor);
        }
    });
}

const funcionAsincrona = async () => {
    try {
        const resultado = await dividir(3, 0);//Await espero que se resuelva la operacion dividir
        console.log(resultado);
    } catch (error) {
        console.log(error)
    }
}
