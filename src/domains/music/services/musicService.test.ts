import { prismaMock } from "../../../../config/singleton";
import MusicService from "./MusicServices";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { mockReset } from "jest-mock-extended";

const musicService = new MusicService();

describe("MusicService", () => {
	beforeEach(() => {
		mockReset(prismaMock);
	});

	describe("create", () => {
		test("dados válidos fornecidos ==> cria uma nova música", async () => {
			const music = {
				id: 1,
				name: "Music Name",
				genre: "Music Genre",
				album: "Music Album",
				authorId: 1
			};
			prismaMock.music.create.mockResolvedValue(music);
			await expect(musicService.create(music)).resolves.toEqual(music);
		});
		test("nome não fornecido ==> lança InvalidParamError", async () => {
			const music = {
				name: "",
				genre: "Music Genre",
				album: "Music Album",
				authorId: 1
			};
			await expect(musicService.create(music)).rejects.toThrow(InvalidParamError);
		});
		test("gênero não fornecido ==> lança InvalidParamError", async () => {
			const music = {
				name: "Music Name",
				genre: "",
				album: "Music Album",
				authorId: 1
			};
			await expect(musicService.create(music)).rejects.toThrow(InvalidParamError);
		});
		test("álbum não fornecido ==> lança InvalidParamError", async () => {
			const music = {
				name: "Music Name",
				genre: "Music Genre",
				album: "",
				authorId: 1
			};
			await expect(musicService.create(music)).rejects.toThrow(InvalidParamError);
		});
	});

	describe("readAll", () => {
		test("músicas disponíveis ==> retorna todas as músicas", async () => {
			const musics = [
				{ id: 1, name: "Music One", genre: "Genre One", album: "Album One", authorId: 1 },
				{ id: 2, name: "Music Two", genre: "Genre Two", album: "Album Two", authorId: 2 },
			];
			prismaMock.music.findMany.mockResolvedValue(musics);
			await expect(musicService.readAll()).resolves.toEqual(musics);
		});
		test("nenhuma música encontrada ==> lança QuerryError", async () => {
			prismaMock.music.findMany.mockResolvedValue([]);
			await expect(musicService.readAll()).rejects.toThrow(QueryError);
		});
	});

	describe("readById", () => {
		test("ID válido fornecido ==> retorna música correspondente", async () => {
			const music = { id: 1, name: "Music One", genre: "Genre One", album: "Album One", authorId: 1 };
			prismaMock.music.findUnique.mockResolvedValue(music);
			await expect(musicService.readById(1)).resolves.toEqual(music);
		});
		test("ID não fornecido ==> lança InvalidParamError", async () => {
			await expect(musicService.readById(null as any)).rejects.toThrow(InvalidParamError);
		});
		test("ID não encontrado ==> lança QueryError", async () => {
			prismaMock.music.findUnique.mockResolvedValue(null);
			await expect(musicService.readById(1)).rejects.toThrow(QueryError);
		});
		test("erro no banco de dados ==> lança QueryError", async () => {
			prismaMock.music.findUnique.mockRejectedValue(new QueryError("Database connection error"));
			await expect(musicService.readById(1)).rejects.toThrow(QueryError);
		});
	});

	describe("update", () => {
		test("dados válidos fornecidos", async () => {
			const music = { id: 1, name: "Updated Name", genre: "Updated Genre", album: "Updated Album", authorId: 1 };
            
			prismaMock.music.findUnique.mockResolvedValue(music);
			prismaMock.music.update.mockResolvedValue(music);
			await expect(musicService.update(1, { id: 1, name: "Updated Name", genre: "Updated Genre", album: "Updated Album", authorId: 1 })).resolves.toEqual(music);
		});
		test("ID não fornecido ==> lança InvalidParamError", async () => {
			await expect(musicService.update(null as any, { name: "Updated Music", genre: "Updated Genre", album: "Updated Album", authorId: 1 })).rejects.toThrow(InvalidParamError);
		});
		test("música não encontrada ==> lança QueryError", async () => {
			prismaMock.music.findUnique.mockResolvedValue(null);
			await expect(musicService.update(1, { name: "Updated Name", genre: "Updated Genre", album: "Updated Album", authorId: 1 })).rejects.toThrow(QueryError);
		});
		test("nenhuma atualização fornecida ==> lança InvalidParamError", async () => {
			prismaMock.music.findUnique.mockResolvedValue({ id: 1, name: "Music Name", genre: "Music Genre", album: "Music Album", authorId: 1 });
			await expect(musicService.update(1, {})).rejects.toThrow(InvalidParamError);
		});
		test("dados de atualização inválidos fornecidos ==> lança InvalidParamError", async () => {
			const invalidUpdate = {
				name: 123, //nome deve ser string
				genre: "Music Genre",
				album: "", //álbum não pode estar vazio
				authorId: "1", //authorId deve ser int
			};
      
			prismaMock.music.findUnique.mockResolvedValue({ id: 1, name: "Music Name", genre: "Music Genre", album: "Music Album", authorId: 1 });
			await expect(musicService.update(1, invalidUpdate as any)).rejects.toThrow(InvalidParamError);
		});
	});

	describe("delete", () => {
		test("ID válido fornecido ==> deleta o artista", async () => {
			const music = { id: 1, name: "Music Name", genre: "Music Genre", album: "Music Album", authorId: 1 };
      
			prismaMock.music.findUnique.mockResolvedValue(music);
			prismaMock.music.delete.mockResolvedValue(music);
      
			await expect(musicService.delete(1)).resolves.toEqual(music);
		});
		test("ID não fornecido ==> lança InvalidParamError", async () => {
			await expect(musicService.delete(null as any)).rejects.toThrow(InvalidParamError);
		});
		test("música não encontrada ==> lança QueryError", async () => {
			prismaMock.music.findUnique.mockResolvedValue(null);
			await expect(musicService.delete(1)).rejects.toThrow(QueryError);
		});
	});

	describe("userWhoListenedMusic", () => {
		test("ID de música válido fornecido ==> retorna os usuários que ouviram a música", async () => {
			const musicID = 1;
			const users = [
				{ id: 1, name: "User One", email: "user1@example.com", photo: null, password: "password1", role: "user" },
				{ id: 2, name: "User Two", email: "user2@example.com", photo: null, password: "password2", role: "user" },
			];

			prismaMock.user.findMany.mockResolvedValue(users);
			await expect(musicService.userWhoListenedMusic(musicID)).resolves.toEqual(users);
		});
		test("ID não fornecido ==> lança InvalidParamError", async () => {
			await expect(musicService.userWhoListenedMusic(null as any)).rejects.toThrow(InvalidParamError);
		});
		test("nenhum usuário encontrado ==> lança QueryError", async () => {
			const musicId = 1;
			prismaMock.user.findMany.mockResolvedValue([]);
			await expect(musicService.userWhoListenedMusic(musicId)).rejects.toThrow(QueryError);
		});
		test("erro no banco de dados ==> lança QueryError", async () => {
			const musicId = 1;
			prismaMock.user.findMany.mockRejectedValue(new QueryError("Database connection error"));
			await expect(musicService.userWhoListenedMusic(musicId)).rejects.toThrow(QueryError);
		});
	});

	describe("readMusicByArtist", () => {
		test("ID de artista válido fornecido ==> retorna as músicas do artista", async () => {
			const authorId = 1;
			const musics = [
				{ id: 1, name: "Music One", genre: "Genre One", album: "Album One", authorId: 1 },
				{ id: 2, name: "Music Two", genre: "Genre Two", album: "Album Two", authorId: 2 },
			];
			prismaMock.music.findMany.mockResolvedValue(musics);
			await expect(musicService.readMusicByArtist(authorId)).resolves.toEqual(musics);
		});
		test("ID não fornecido ==> lança InvalidParamError", async () => {
			await expect(musicService.readMusicByArtist(null as any)).rejects.toThrow(InvalidParamError);
		});
		test("nenhuma música encontrada ==> lança QueryError", async () => {
			const authorId = 1;
			prismaMock.music.findMany.mockResolvedValue([]);
			await expect(musicService.readMusicByArtist(authorId)).rejects.toThrow(QueryError);
		});
		test("erro no banco de dados ==> lança QueryError", async () => {
			const authorId = 1;
			prismaMock.music.findMany.mockRejectedValue(new QueryError("Database connection error"));
			await expect(musicService.readMusicByArtist(authorId)).rejects.toThrow(QueryError);
		});
	});
});