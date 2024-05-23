import { Music } from '.prisma/client';
import prisma from '../../../../config/prismaClient'

class MusicService {
    async create(body: Music){
        const music = await prisma.music.create({
            data: {
                id: body.id,
                name: body.name,
                genre: body.genre,
                album: body.album,
                authorId: body.authorId
            }
        });
        return music;
    }

    async readAll(){
        const musics = await prisma.music.findMany();
        return musics;
    }

    async readById(id: number){
        const music = await prisma.music.findUnique({
            where: {id:id}
        });
        return music
    }

    async update(id: number, body: Partial<Music>){
        const music = await prisma.music.update({
            where: {id:id},
            data: body
        });
        return music;
    }

    async delete(id:number){
        const music = await prisma.music.delete({
            where: {id:id}
        });
        return music;
    } 
}

export default MusicService;