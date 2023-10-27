//sincronismo
console.log('*** Sincronismo ***')
console.log('Inicio de tareas');
operacionSync('Task 1', 2000);
operacionSync('Task 2', 1000);
console.log('Fin de tareas');

function sleepSync(timeout) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout);
}


function operacionSync(task, timeout) {
    console.log('Realizando Operación:', task);
    sleepSync(timeout);
    console.log('Fin Operacion', task);
};

//asincronismo
const temporizador = (timeout, task, callback) => {
    setTimeout(() => {
        callback();
        console.log('Fin Operacion', task);
    }, timeout);
};

const operacionAsync = (task) => { console.log('Realizando Operacion', task); };

console.log('*** Asincronismo ***')
console.log('Inicio de tareas');
temporizador(5000, 'Task 1', () => operacionAsync('Task 1'));
temporizador(1000, 'Task 2', () => operacionAsync('Task 2'));
console.log('Fin de tareas');