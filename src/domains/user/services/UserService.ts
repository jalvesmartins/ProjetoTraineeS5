import { User } from '.prisma/client';
import prisma from '../../../../config/prismaClient'

class ServiceUser {
    async create(body: User){
        const createUser = await prisma.user.create({
            data: {
                name:   body.name,
                email:  body.email,
                photo:  body.photo,
                password: body.password,
                role:     body.role
            }
        });

        return createUser;
    }

    async readAll(){
        const readUser = await prisma.user.findMany();
        return readUser;
    }

    async readById(id: number){
        const readUserId = await prisma.user.findUnique({
            where: {id:id}
        });
        return readUserId;
    }

    async update(id: number, body: Partial<User>) {
        const UpdateUser = await prisma.user.update({
            data: body,
            where:{id:id},
        })
        const UpdatedUser = await prisma.user.findUnique({
            where:{id:id}
        })
        return UpdatedUser;
    }

    async delete(id:number) {
        const DeletedUser = await prisma.user.findUnique({
            where:{id:id}
        })
        const UserDelete = await prisma.user.delete({
            where:{id:id}
        })
        return DeletedUser;
    }   
}

export default new ServiceUser();