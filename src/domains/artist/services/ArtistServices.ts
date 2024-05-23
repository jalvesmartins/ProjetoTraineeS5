import { Artist } from '@prisma/client';
import prisma from '../../../../config/prismaClient'
    
class ArtistService {
    async create(body: Artist){
        const artist = await prisma.artist.create({
            data: {
                id: body.id,
                name: body.name,
                photo: body.photo,
                stream: body.stream
            }
        })
        return artist;
    }

    async readAll(){
        const artists = await prisma.artist.findMany();
        return artists;
    }

    async readById(id: number){
        const artist = await prisma.artist.findUnique({
            where: {id:id}
        });
        return artist
    }

    async update(id: number, body: Partial<Artist>){
        const artist = await prisma.artist.update({
            where: {id:id},
            data: body
        });
        return artist;
    }

} 

export default ArtistService;