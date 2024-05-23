import { Music } from '.prisma/client';
import prisma from '../../../../config/prismaClient'

class MusicService {
    //Cria uma nova música
    async create(body: Music) {
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

    //Retorna todas as músicas
    async readAll() {
        const musics = await prisma.music.findMany();
        return musics;
    }

    //Retorna uma música pelo ID
    async readById(id: number) {
        const music = await prisma.music.findUnique({
            where: { id: id }
        });
        return music;
    }

    //Atualiza uma música pelo ID
    async update(id: number, body: Partial<Music>) {
        const music = await prisma.music.update({
            where: { id: id },
            data: body
        });
        return music;
    }

    //Deleta uma música pelo ID
    async delete(id: number) {
        const music = await prisma.music.delete({
            where: { id: id }
        });
        return music;
    }
}

export default MusicService;
