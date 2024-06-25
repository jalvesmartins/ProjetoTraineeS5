import { prismaMock } from "../../../../config/singleton";
import ArtistService from "./ArtistServices";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { mockReset } from "jest-mock-extended";

const artistService = new ArtistService();

describe('ArtistService', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('create', () => {
    test('dados válidos fornecidos ==> cria um novo artista', async () => {
      const artist = {
        id: 1,
        name: 'Artist Name',
        photo: 'url-photo',
        stream: 1000,
      };

      const artistInput = {
        name: 'Artist Name',
        photo: 'url-photo',
        stream: 1000,
      };

      prismaMock.artist.create.mockResolvedValue(artist);

      await expect(artistService.create(artistInput)).resolves.toEqual(artist);
    });

    test('nome não fornecido ==> lança InvalidParamError', async () => {
      const artistInput = {
        name: '',
        photo: 'url-photo',
        stream: 1000
      };

      await expect(artistService.create(artistInput as any)).rejects.toThrow(InvalidParamError);
    });

    test('foto não fornecida ==> lança InvalidParamError', async () => {
      const artistInput = {
        name: 'Artist Name',
        photo: '',
        stream: 1000
      };

      await expect(artistService.create(artistInput as any)).rejects.toThrow(InvalidParamError);
    });

    test('dados inválidos fornecidos ==> lança InvalidParamError', async () => {
      const invalidArtistInput = {
        name: 12345, // Nome só pode ser string 
        photo: 'url-photo',
        stream: 1000
      };

      await expect(artistService.create(invalidArtistInput as any)).rejects.toThrow(InvalidParamError);
    });
  });

  describe('readAll', () => {
    test('artistas disponíveis ==> retorna todos os artistas', async () => {
      const artists = [
        { id: 1, name: 'Artist One', photo: 'url/to/photo1', stream: 1000 },
        { id: 2, name: 'Artist Two', photo: 'url/to/photo2', stream: 2000 },
      ];
      prismaMock.artist.findMany.mockResolvedValue(artists);
      await expect(artistService.readAll()).resolves.toEqual(artists);
    });

    test('nenhum artista encontrado ==> lança QueryError', async () => {
      prismaMock.artist.findMany.mockResolvedValue([]);
      await expect(artistService.readAll()).rejects.toThrow(QueryError);
    });
  });

  describe('readById', () => {
    test('ID válido fornecido ==> retorna artista correspondente', async () => {
      const artist = { id: 1, name: 'Artist Name', photo: 'url-photo', stream: 1000 };

      prismaMock.artist.findUnique.mockResolvedValue(artist);
      await expect(artistService.readById(1)).resolves.toEqual(artist);
    });

    test('ID não fornecido ==> lança InvalidParamError', async () => {
      await expect(artistService.readById(null as any)).rejects.toThrow(InvalidParamError);
    });

    test('artista não encontrado por ID ==> lança QueryError', async () => {
      prismaMock.artist.findUnique.mockResolvedValue(null);
      await expect(artistService.readById(1)).rejects.toThrow(QueryError);
    });
  });

  describe('update', () => {
    test('dados válidos fornecidos ==> atualiza o artista', async () => {
      const artist = { id: 1, name: 'Updated Artist', photo: 'url/to/updated/photo', stream: 1500 };

      prismaMock.artist.findUnique.mockResolvedValue(artist);
      prismaMock.artist.update.mockResolvedValue(artist);

      await expect(artistService.update(1, { name: 'Updated Artist', photo: 'url/to/updated/photo' })).resolves.toEqual(artist);
    });

    test('ID não fornecido ==> lança InvalidParamError', async () => {
      await expect(artistService.update(null as any, { name: 'Updated Artist' })).rejects.toThrow(InvalidParamError);
    });

    test('artista não encontrado ==> lança QueryError', async () => {
      prismaMock.artist.findUnique.mockResolvedValue(null);
      await expect(artistService.update(1, { name: 'New Artist Name' })).rejects.toThrow(QueryError);
    });

    test('nenhuma atualização fornecida ==> lança InvalidParamError', async () => {
      prismaMock.artist.findUnique.mockResolvedValue({ id: 1, name: 'Artist Name', photo: 'url/to/photo', stream: 1000 });
      await expect(artistService.update(1, {})).rejects.toThrow(InvalidParamError);
    });

    test('dados de atualização inválidos fornecidos ==> lança InvalidParamError', async () => {
      const invalidUpdate = {
        name: 12345, // Nome deve ser string
        photo: 'url-photo',
        stream: '1000', // Stream deve ser número
      };

      prismaMock.artist.findUnique.mockResolvedValue({ id: 1, name: 'Artist Name', photo: 'url/to/photo', stream: 1000 });

      await expect(artistService.update(1, invalidUpdate as any)).rejects.toThrow(InvalidParamError);
    });
  });

  describe('delete', () => {
    test('ID válido fornecido ==> deleta o artista', async () => {
      const artist = { id: 1, name: 'Artist Name', photo: 'url/to/photo', stream: 1000 };

      prismaMock.artist.findUnique.mockResolvedValue(artist);
      prismaMock.artist.delete.mockResolvedValue(artist);

      await expect(artistService.delete(1)).resolves.toEqual(artist);
    });

    test('ID não fornecido ==> lança InvalidParamError', async () => {
      await expect(artistService.delete(null as any)).rejects.toThrow(InvalidParamError);
    });

    test('artista não encontrado ==> lança QueryError', async () => {
      prismaMock.artist.findUnique.mockResolvedValue(null);

      await expect(artistService.delete(1)).rejects.toThrow(QueryError);
    });
  });
});
