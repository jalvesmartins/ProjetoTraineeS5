import { UserMusic } from "@prisma/client";
import { Prisma } from "@prisma/client";

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
        return ;
    }
}

export default UserMusicService;