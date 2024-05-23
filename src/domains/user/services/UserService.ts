import { User } from '.prisma/client';
import prisma from '../../../../config/prismaClient'

class ServiceUser {
    async create(body: User){
        const CreateUser = await prisma.user.create({
            data: {
                name:   body.name,
                email:  body.email,
                photo:  body.photo,
                password: body.password,
                role:     body.role
            }
        });

        return CreateUser;
    }
    async read(){
        const ReadUser = await prisma.user.findMany();
        return ReadUser;
    }
    async update() {
        const UpdateUser = await prisma.user.update({
            data:{
                name: 'João Pedro',
                email: 'jp@hotmail.com',
                role: 'Conta Comum'
            },
            where:{
                id: 4
            },
        })
        const UpdatedUser = await prisma.user.findUnique({
            where:{
                id:1
            }
        })
        return UpdatedUser;
    }
    async delete() {
        const DeletedUser = await prisma.user.findUnique({
            where:{
                id:4
            }
        })
        const UserDelete = await prisma.user.delete({
            where:{
                id:4
            }
        })
        return DeletedUser;
    }   
}

export default new ServiceUser();