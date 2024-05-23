import { userInfo } from "os";
import UserService from "./src/domains/user/services/UserService";

async function mainCreate() {
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

async function mainRead() {
    const ReadUser = await UserService.read();
    console.log(ReadUser);
}

async function mainUpdate(){
    const UpdateUser = await UserService.update();
    console.log(UpdateUser);
}

async function mainDelete(){
    const DeleteUser = await UserService.delete();
    console.log(DeleteUser)
}

mainRead();