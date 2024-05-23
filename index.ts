import UserService from "./src/domains/user/services/UserService";

async function main() {
    const usuario2 = {
        id: 0,
        name: 'Bernardo Viggiano',
        email: 'bv@gmail.com',
        photo: null,
        password: '123456',
        role: 'Conta Básica'
    }

    const user = await UserService.create(usuario2);

    console.log(user);
}

main();