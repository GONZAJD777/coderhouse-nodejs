const persona = {
    nombre: '',
    apellido: '',
    dni: ''
}

//Ejercicios con funciones
console.log('Persona Default: ', persona);
updateUser('A', 'B');
console.log('Persona Actualizada', persona);

function updateUser(nombre, apellido) {
    persona.nombre = nombre;
    persona.apellido = apellido;
}