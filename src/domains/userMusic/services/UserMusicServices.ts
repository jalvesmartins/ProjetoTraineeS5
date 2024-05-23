import  { UserMusic }  from ".prisma/client";
import prisma from '../../../../config/prismaClient'

class UserMusicService {
    //Adiciona música a um usuário
    async addMusicToUser(userId: number, musicId: number){

    }

    //Listar as músicas de um usuário
    async getMusicsByUser(userId: number){

    }

    //Remove uma música de um usuário 
    async removeMusicFromUser(userId: number, musicId: number){

    }

    //Verifica se um usuário já escutou determinada música
    async hasUserHeardMusic(userId: number, musicId: number): Promise<boolean> {
        const usersMusic = await prisma.userMusic.findUnique({
                where: {
                    userId_musicId: {
                        userId: userId,
                        musicId: musicId
                    }
                }
         });
        return usersMusic !== null;
    }
}

export default UserMusicService;