import { existsSync, writeFileSync, readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class FileManager {
    path;

    constructor(route) {
        this.path = dirname(__dirname) + route;
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
            //console.log("00011 -> ", error);
            //throw new CustomError(11, 'Error al guardar datos en el archivo');
            throw new Error ('00011|Error al obtener el ultimo id');
        }
    }

    saveAllDataToFile(data) {
        try {
            writeFileSync(this.path, JSON.stringify(data, null, '\t'), 'utf8');
            return true;
        } catch (error) {
            //throw new CustomError(10, 'Error al actualizar datos en el archivo');
            throw new Error ('00010|Error al obtener el ultimo id');
        }
    }
}

export default FileManager;