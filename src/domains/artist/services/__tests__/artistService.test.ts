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

  });
});