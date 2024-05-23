import { User } from '.prisma/client';
import prisma from '../../../../config/prismaClient'

class ServiceUser {
    //Cria um usuário
    async create(body: User) {
        const createUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                photo: body.photo,
                password: body.password,
                role: body.role
            }
        });

        return createUser;
    }

    //Retorna todos os usuários
    async readAll() {
        const readUser = await prisma.user.findMany();
        return readUser;
    }

    //Retorna um usuário pelo ID
    async readById(id: number) {
        const readUserId = await prisma.user.findUnique({
            where: { id: id }
        });
        return readUserId;
    }

    //Atualiza um usuário pelo ID
    async update(id: number, body: Partial<User>) {
        const updateUser = await prisma.user.update({
            data: body,
            where: { id: id },
        })
        const updatedUser = await prisma.user.findUnique({
            where: { id: id }
        })
        return updatedUser;
    }

    //Deleta um usuário pelo ID
    async delete(id: number) {
        const deletedUser = await prisma.user.findUnique({
            where: { id: id }
        })
        const userDelete = await prisma.user.delete({
            where: { id: id }
        })
        return deletedUser;
    }
}

export default new ServiceUser();
