import { Artist } from '@prisma/client';
import prisma from '../../../../config/prismaClient'
import { QueryError } from '../../../../errors/QueryError';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
    
class ArtistService {
    //Cria um novo artista
    async create(body: Artist) {
        if (!body.name || !body.photo) {
            throw new InvalidParamError('Nome e foto são obrigatórios');
        }

        const artist = await prisma.artist.create({
            data: {
                id: body.id,
                name: body.name,
                photo: body.photo,
                stream: body.stream
            }
        })

        if(!artist){
            throw new QueryError("Erro ao criar artista");
        }
        return artist;
    }

    //Retorna todos os artistas
    async readAll() {
        const artists = await prisma.artist.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        if(!artists){
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
        if(!id){
            throw new InvalidParamError("É necessário informar um ID");
        }

        const updateData = {
            ...(body.name && { name: body.name }),
            ...(body.photo && { photo: body.photo }),
            ...(body.stream && { stream: body.stream })
        };
    
        const updatedArtist = await prisma.artist.update({
            where: { id: id },
            data: updateData
        });

        if (!updatedArtist) {
            throw new QueryError('Artista não enconstrado');
        }
    
        const artist = await prisma.artist.findUnique({
            where: { id: id }
        });
    
        return artist;
    }    

    //Deleta um artista pelo ID
    async delete(id: number) {
        if(!id){
            throw new InvalidParamError("É necessário informar um ID");
        }

        const artist = await prisma.artist.delete({
            where: { id: id }
        });

        if(!artist){
            throw new QueryError("Artista não encontrado");
        }

        return artist;
    }
} 

export default ArtistService;