import { User } from '.prisma/client';
import prisma from '../../../../config/prismaClient'

class ServiceUser {
    async create(body: User){
        const user = await prisma.user.create({
            data: {
                name:   body.name,
                email:  body.email,
                photo:  body.photo,
                password: body.password,
                role:     body.role
            }
        });

        return user;
    }
}

export default new ServiceUser();