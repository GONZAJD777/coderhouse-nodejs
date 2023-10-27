const fs = require('fs');

fs.writeFile('./info-callback.txt', 'persistencia en memoria con CB',
    error => {
        if (error) {
            throw new Error(`Error en la creación del archivo`)
        }

        fs.readFile('./info-callback.txt', 'utf-8', (error, contenido) => {
            if (error) {
                throw new Error(`Error en la lectura del archivo`)
            }
            console.log(contenido)
        }
        );

        fs.appendFile('./info-callback.txt', '\nActualizamos información', error => {
            if (error) {
                throw new Error(`Error en la actualización del archivo`);
            }
            fs.readFile('./info-callback.txt', 'utf-8', (error, contenido) => {
                if (error) {
                    throw new Error(`Error en la lectura del archivo`)
                }
                console.log(contenido);

                fs.unlink('./info-callback.txt', error => {
                    if (error) {
                        throw new Error(`Error en la eliminación del archivo`)
                    }
                })
            })
        })
    }
);