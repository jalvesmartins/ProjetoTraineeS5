import { Music } from ".prisma/client";
import prisma from "../../../../config/client";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";

class MusicService {
	//Cria uma nova música
	async create(body: { name: string; genre: string; album: string; authorId: number}) {
		if (!body.name || !body.genre || !body.album || !body.authorId) {
			throw new InvalidParamError("Nome, gênero, álbum e ID do autor são obrigatórios");
		}
		const data: {
			name: string;
			genre: string;
			album: string;
			authorId: number;
	} = {
		name: body.name,
		genre: body.genre,
		album: body.album,
		authorId: body.authorId
	};
		
		const music = await prisma.music.create({ data: data });

		if (!music) {
			throw new InvalidParamError("Erro ao criar música");
		}

		return music;
	}

	//Retorna todas as músicas
	async readAll() {
		const musics = await prisma.music.findMany({
			orderBy: {
				name: "asc"
			}
		});
		if (!musics || musics.length === 0) {
			throw new QueryError("Nenhuma música encontrada");
		}
		return musics;
	}

	//Retorna uma música pelo ID
	async readById(id: number) {
		if (!id) {
			throw new InvalidParamError("É necessário informar um ID");
		}
		const music = await prisma.music.findUnique({
			where: { id: id }
		});
		if (!music) {
			throw new QueryError("Música não encontrada");
		}
		return music;
	}

	//Atualiza uma música pelo ID
	async update(id: number, body: Partial<Music>) {
		if (!id) {
			throw new InvalidParamError("É necessário informar um ID");
		}
      
		// Adicionando validações para os tipos dos dados de atualização
		if (body.name && typeof body.name !== "string") {
			throw new InvalidParamError("O nome deve ser uma string");
		}
		if (body.genre && typeof body.genre !== "string") {
			throw new InvalidParamError("O gênero deve ser uma string");
		}
		if (body.album && typeof body.album !== "string") {
			throw new InvalidParamError("O álbum deve ser uma string");
		}
		if (body.authorId && typeof body.authorId !== "number") {
			throw new InvalidParamError("O authorId deve ser um número");
		}
        
		const updateData = {
			...(body.name && { name: body.name }),
			...(body.genre && { genre: body.genre }),
			...(body.album && { album: body.album }),
			...(body.authorId && { authorId: body.authorId })
		};

		const checkMusic = await prisma.music.findUnique({
			where: { id: id }
		});
      
		if (!checkMusic) {
			throw new QueryError("Música não encontrada");
		}
      
		if (Object.keys(updateData).length === 0) {
			throw new InvalidParamError("Nenhuma atualização foi fornecida");
		}
      
		const updatedMusic = await prisma.music.update({
			where: { id: id },
			data: updateData
		});
      
		return updatedMusic;
	}

	//Deleta uma música pelo ID
	async delete(id: number) {
		if(!id){
			throw new InvalidParamError("É necessário informar um ID");
		}

		const checkMusic = await prisma.music.findUnique({
			where: {id: id}
		});

		if(!checkMusic){
			throw new QueryError("Música não encontrada");
		}

		const music = await prisma.music.delete({
			where: { id: id }
		});

		return music;
	}

	//Lista quais usuários já escutaram determinada música
	async userWhoListenedMusic(musicId: number) {
		if(!musicId) {
			throw new InvalidParamError("É necessário informar um ID");
		}
		const users = await prisma.user.findMany({ where: { musics: { some: { id: musicId } } } });
		if (!users.length) {
			throw new QueryError("Nenhum usuário encontrado para essa música");
		}
		return users;
	}

	//Lista todas as músicas de um determinado artista
	async readMusicByArtist(authorId: number) {
		if (!authorId) {
			throw new InvalidParamError("É necessário informar um ID");
		}
		const musics = await prisma.music.findMany({ where: { authorId: authorId }, 
			orderBy: {
				name: "asc"
			} 
		});
		if (!musics.length) {
			throw new QueryError("Nenhuma música encontrada para esse artista");
		}
		return musics;
	}
}

export default MusicService;