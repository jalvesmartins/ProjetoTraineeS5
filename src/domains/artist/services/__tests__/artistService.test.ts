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


});