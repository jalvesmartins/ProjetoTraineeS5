import UserService from "./src/domains/user/services/UserService";

async function mainCreate() {
    const usuario2 = {
        id: 1,
        name: 'Nando',
        email: 'nando@gmail.com',
        photo: null,
        password: 'Senha123',
        role: 'Conta Comum'
    }

    const CreateUser = await UserService.create(usuario2);
    console.log(CreateUser);
}

async function mainRead() {
    const ReadUser = await UserService.read();
    console.log(ReadUser);
}


mainRead();