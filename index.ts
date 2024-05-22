import UserService from "./src/domains/user/services/UserService";

async function main() {
    const usuario2 = {
        id: 0,
        name: 'Jh',
        email: 'jh@gmail.com',
        photo: null,
        password: 'Senha',
        role: 'Conta Premium'
    }

    const user = await UserService.create(usuario2);

    console.log(user);
}

main();