const fs = require('fs');

fs.writeFileSync('./ejemplo.txt', 'Creamos el archivo con fs para persistencia en archivo');

if (fs.existsSync('./ejemplo.txt')) {
    let contenido = fs.readFileSync('./ejemplo.txt', 'utf-8');
    console.log(contenido);

    fs.appendFileSync('./ejemplo.txt', ' \nSalimos de la persistencia en memoria');
    contenido = fs.readFileSync('./ejemplo.txt', 'utf-8');
    console.log(contenido);

    fs.unlinkSync('./ejemplo.txt');
}