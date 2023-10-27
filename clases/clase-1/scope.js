const global = 'test'
function prueba() {
    const variable = 1;
    console.log('Local:', variable);
    console.log('Global:', global)
}
prueba();
console.log('Global:', global);
try {
    console.log('Local:', variable);
} catch (error) {
    console.log('No se puede acceder a la varibale local, ', error.message);
}