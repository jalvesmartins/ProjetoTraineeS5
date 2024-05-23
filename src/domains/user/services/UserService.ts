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
}

export default new ServiceUser();