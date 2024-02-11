import { existsSync, writeFileSync, readFileSync } from 'fs';
//import { dirname } from 'path';
//import { fileURLToPath } from 'url';
import { __dirname } from '../../utils.js';


import { CustomError, NotFoundError } from '../../models/custom.error.js';




class FileManager {
    path;

    constructor(route) {
        this.path = __dirname + route;
        this.createFile();
    }

    async createFile() {
        if (!existsSync(this.path)) writeFileSync(this.path, JSON.stringify([]), 'utf8');
    }
    
    getDataFromFile() {
        return JSON.parse(readFileSync(this.path, 'utf-8'));
    }

    saveDataToFile(data) {
        try {
            const allData = this.getDataFromFile();
            allData.push(data);
            return this.saveAllDataToFile(allData);
        } catch (error) {
            throw new CustomError(500001, 'Error al guardar datos en el archivo');
        }
    }

    saveAllDataToFile(data) {
        try {
            writeFileSync(this.path, JSON.stringify(data, null, '\t'), 'utf8');
            return true;
        } catch (error) {
            throw new CustomError(500002, 'Error al actualizar datos en el archivo');
            //throw new Error ('00010|Error al obtener el ultimo id');
        }
    }
}

export default FileManager;