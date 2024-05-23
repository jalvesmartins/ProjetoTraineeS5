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

} 

export default ArtistService;