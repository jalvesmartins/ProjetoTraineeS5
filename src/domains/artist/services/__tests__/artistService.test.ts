import { prismaMock } from "../../../../../config/singleton";
import ArtistService from "../ArtistServices";
import { QueryError } from "../../../../../errors/QueryError";
import { InvalidParamError } from "../../../../../errors/InvalidParamError";
import { mockReset } from "jest-mock-extended";

const artistService = new ArtistService();

describe('ArtistService', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('create', () => {
    test('deveria criar um novo artista', async () => {
        const artist = {
            id: 1,
            name: 'Artist Name',
            photo: 'url-photo',
            stream:1000,
        };
        prismaMock.artist.create.mockResolvedValue(artist);

        await expect(artistService.create(artist)).resolves.toEqual(artist);
    });

    test('deveria lançar InvalidParamError se o nome estiver faltando', async () => {
        const artist = {
            id:1,
            name:'',
            photo:'url-photo',
            stream:1000
        }
        await expect(artistService.create(artist as any)).rejects.toThrow(InvalidParamError);
    });

    test('deveria lançar InvalidParamError se a foto estiver faltando', async () => {
        const artist = {
            id:1,
            name:'Artist Name',
            photo:'',
            stream:1000
        }
        await expect(artistService.create(artist as any)).rejects.toThrow(InvalidParamError);
    });

    test('deveria lançar InvalidParamError se algum dado for inválido', async () => {
        const invalidArtist = {
          id: 1,
          name: 12345, 
          photo: 'url-photo',
          stream: 1000
        };
        await expect(artistService.create(invalidArtist as any)).rejects.toThrow(InvalidParamError);
      });
  });

  describe('readAll', () => {
    test('deveria retornar todos os artistas', async() => {
        const artists = [
            { id: 1, name: 'Artist One', photo: 'url/to/photo1', stream: 1000 },
            { id: 2, name: 'Artist Two', photo: 'url/to/photo2', stream: 2000 },
        ];
        prismaMock.artist.findMany.mockResolvedValue(artists);
        await expect(artistService.readAll()).resolves.toEqual(artists);
    })

    test('deveria lançar QueryError se não achar nenhum artista',async () => {
        prismaMock.artist.findMany.mockResolvedValue([]);
        await expect(artistService.readAll()).rejects.toThrow(QueryError);
    });
  });

  describe('readById', () => {
    test('deveria retornar um artista por id', async() => {
        const artist = {id: 1, name: 'Artist Name', photo: 'url-photo', stream: 1000};

        prismaMock.artist.findUnique.mockResolvedValue(artist);
        await expect(artistService.readById(1)).resolves.toEqual(artist);
    });

    test('deveria lançar InvalidParamError se o id não for passado', async () => {
        await expect(artistService.readById(null as any)).rejects.toThrow(InvalidParamError);
      });

    test('deveria lançar QueryError se o artista não for encontrado', async () => {
    prismaMock.artist.findUnique.mockResolvedValue(null);
    await expect(artistService.readById(1)).rejects.toThrow(QueryError);
    });
  });

  describe('update', () => {
    test('deveria atualizar um artista pelo id', async () => {
        const artist = {id: 1, name: 'Updated Artist', photo: 'url/to/updated/photo', stream: 1500};

        prismaMock.artist.findUnique.mockResolvedValue(artist);
        prismaMock.artist.update.mockResolvedValue(artist);

        await expect(artistService.update(1, {name: 'Updated Artist',  photo: 'url/to/updated/photo'})).resolves.toEqual(artist);
    });

    test('deveria lançar InvalidParamError se o id não for fornecido', async () => {
        await expect(artistService.update(null as any, { name: 'Updated Artist' })).rejects.toThrow(InvalidParamError);
      });

    test('deveria lançar QueryError se o artista não for encontrado ao atualizar', async () => {
        prismaMock.artist.findUnique.mockResolvedValue(null);
        await expect(artistService.update(1, {name: 'New Artists Name'})).rejects.toThrow(QueryError);
    });
    
    test('deveria lançar InvalidParamError se nenhuma atualização for fornecida', async() => {
        prismaMock.artist.findUnique.mockResolvedValue({ id: 1, name: 'Artist Name', photo: 'url/to/photo', stream: 1000 });
        await expect(artistService.update(1, {})).rejects.toThrow(InvalidParamError);
    });
  });

  describe('delete', () => {
    test('deveria deletar um artista por id', async () => {
        const artist = { id: 1, name: 'Artist Name', photo: 'url/to/photo', stream: 1000 };

        prismaMock.artist.findUnique.mockResolvedValue(artist);
        prismaMock.artist.delete.mockResolvedValue(artist);
  
        await expect(artistService.delete(1)).resolves.toEqual(artist);       
    });

    test('deveria lançar invalidParamError caso não receba um id', async () => {
        await expect(artistService.delete(null as any)).rejects.toThrow(InvalidParamError);
      });

    test('deveria lançar QueryError caso o artista não seja achado', async () => {
    prismaMock.artist.findUnique.mockResolvedValue(null);

    await expect(artistService.delete(1)).rejects.toThrow(QueryError);
    });

  });
});