import UserManager from "./managers/userManager.js";

const manager = new UserManager('./files/users.json');

const env = async () => {
    const user = {
        nombre: 'Ayelen',
        apellido: 'Leclerc',
        edad: 20,
        curso: 'Back'
    };

    await manager.createUser(user);
    const usuarios = await manager.getUsers();
    console.log('Usuarios cargados en el archivo:', usuarios);
}

env();