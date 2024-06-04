/* eslint-disable indent */
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
        const updateData = {
            ...(body.name && { name: body.name }),
            ...(body.genre && { genre: body.genre }),
            ...(body.album && { album: body.album }),
            ...(body.authorId && { authorId: body.authorId })
        };

        const updatedMusic = await prisma.music.update({
            where: { id: id },
            data: updateData
        });

        const music = await prisma.music.findUnique({
            where: { id: id }
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

    //Lista quais usuários já escutaram determinada música
    async userWhoListenedMusic(musicId: number){
        const usersByMusic = await prisma.music.findUnique({
            where:{ id: musicId },
            select:{ users: true }
        })
        return usersByMusic;
    }
}

export default MusicService;