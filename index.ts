import UserService from "./src/domains/user/services/UserService";

async function main() {
    const usuario2 = {
        id: 0,
        name: 'Henrique do Vale',
        email: 'vicepresida@gmail.com',
        photo: null,
        password: 'GoleiroZe',
        role: 'Conta Comum'
    }

    const CreateUser = await UserService.create(usuario2);
    console.log(CreateUser);
}
main();