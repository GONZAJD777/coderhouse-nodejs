const suma = (numero1, numero2) => {
    return new Promise((resolve, reject) => {
        if (numero1 === 0 || numero2 === 0) reject('Operación innecasaria');
        if (numero1 + numero2 < 0) reject('La calculadora solo devuelve valores positivos');
        resolve(numero1 + numero2)
    })
}

const resta = (numero1, numero2) => {
    return new Promise((resolve, reject) => {
        if (numero1 === 0 || numero2 === 0) reject('Operación inválida');
        if (numero1 - numero2 < 0) reject('La calculadora solo devuelve valores positivos');
        resolve(numero1 - numero2)
    })
}

const division = (numero1, numero2) => {
    return new Promise((resolve, reject) => {
        if (numero2 === 0) reject('No se puede dividir entre cero');

        resolve(numero1 / numero2)
    })
}

const multiplica = (numero1, numero2) => {
    return new Promise((resolve, reject) => {
        if (numero1 < 0 || numero2 < 0) reject('La calculadora solo devuelve valores positivos');
        resolve(numero1 * numero2)
    })
}

const calculos = async () => {
    try {
        const numero1 = 5;
        const numero2 = -7;
        console.log(await suma(numero1, numero2));
        console.log(await resta(numero1, numero2));
        console.log(await division(numero1, numero2));
        console.log(await multiplica(numero1, numero2));
    } catch (error) {
        console.log(error)
    }
}

calculos();