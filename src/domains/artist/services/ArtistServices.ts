import { Artist } from "@prisma/client";
import prisma from "../../../../config/client";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
	
class ArtistService {
	//Cria um novo artista
	async create(body: { name: string; photo: string; stream?: number }) {
		if (!body.name || !body.photo) {
			throw new InvalidParamError("Nome e foto são obrigatórios");
		}
  
		const data: {
			name: string;
			photo: string;
			stream: number;
	} = {
		name: body.name,
		photo: body.photo,
		stream: body.stream ?? 0 
	};
  
		const artist = await prisma.artist.create({
			data: data
		});
  
		if (!artist) {
			throw new InvalidParamError("Erro ao criar artista");
		}
  
		return artist;
	}

	//Retorna todos os artistas
	async readAll() {
		const artists = await prisma.artist.findMany({
			orderBy: {
				name: "asc"
			}
		});
	
		if (!artists || artists.length === 0) {
			throw new QueryError("Nenhum artista encontrado");
		}
		return artists;
	}

	//Retorna um artista pelo ID
	async readById(id: number) {
		if(!id){
			throw new InvalidParamError("É necessário informar um ID");
		}

		const artist = await prisma.artist.findUnique({
			where: { id: id }
		});

		if(!artist){
			throw new QueryError("Artista não encontrado");
		}

		return artist;
	}

	//Atualiza um artista pelo ID
	async update(id: number, body: Partial<Artist>) {
		if (!id) {
			throw new InvalidParamError("É necessário informar um ID");
		}
	
		// Adicionando validações para os tipos dos dados de atualização
		if (body.name && typeof body.name !== "string") {
			throw new InvalidParamError("O nome deve ser uma string");
		}
		if (body.photo && typeof body.photo !== "string") {
			throw new InvalidParamError("A foto deve ser uma string");
		}
		if (body.stream && typeof body.stream !== "number") {
			throw new InvalidParamError("O stream deve ser um número");
		}
	
		const updateData = {
			...(body.name && { name: body.name }),
			...(body.photo && { photo: body.photo }),
			...(body.stream && { stream: body.stream })
		};
	
		const checkArtist = await prisma.artist.findUnique({
			where: { id: id }
		});
	
		if (!checkArtist) {
			throw new QueryError("Artista não encontrado");
		}
	
		if (Object.keys(updateData).length === 0) {
			throw new InvalidParamError("Nenhuma atualização foi fornecida");
		}
	
		const updatedArtist = await prisma.artist.update({
			where: { id: id },
			data: updateData
		});
	
		return updatedArtist;
	}  

	//Deleta um artista pelo ID
	async delete(artistId: number) {
		if (!artistId) {
			throw new InvalidParamError("ID do artista é obrigatório");
		}

		const artist = await prisma.artist.findUnique({
			where: { id: artistId },
		});

		if (!artist) {
			throw new QueryError("Artista não encontrado");
		}

		await prisma.artist.delete({
			where: { id: artistId },
		});

		return artist;
	}
} 

export default ArtistService;