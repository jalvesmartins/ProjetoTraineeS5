import { prismaMock } from "../../../../config/singleton";
import UserService from "./UserService";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { mockReset } from "jest-mock-extended";
import { User } from "@prisma/client";

describe('UserService', () => {
    beforeEach(() => {
      mockReset(prismaMock);
    });

    describe('create', () => {
        test('dados válidos fornecidos ==> cria um novo user', async () => {
            const user = {
                id: 1,
                name: 'user',
				email: 'email@.com',
				photo: 'urlphoto',
				password: 'encrypted',
				role: 'user'
            };
            prismaMock.user.create.mockResolvedValue(user);
      
            await expect(UserService.create(user)).resolves.toEqual(user);
          });

          test('tenta criar adm ==> lança invalid param error', async () => {
            const invalidUser = {
              id: 1,
              name: 'Joao',
              email: 'email@.com',
			  photo: 'urlphoto',
			  password: 'encrypted',
			  role: 'admin'
            };
            await expect(UserService.create(invalidUser)).rejects.toThrow(InvalidParamError);
            });

          test('tenta criar usuário invalido ==> lança invalid param error', async () => {
            const invalidUser = {
              id: 1,
              name: 'Jõao',
              email: null,
			        photo: null,
			        password: 'encrypted',
			        role: 'user'
            };
            await expect(UserService.create(invalidUser as any)).rejects.toThrow(InvalidParamError);
            });

          test('tenta criar com senha <6 digitos ==> lança invalid param error', async () => {
                const invalidUser = {
                  id: 1,
                  name: 'Joao',
                  email: 'email@.com',
                  photo: 'urlphoto',
                  password: 'encry',
                  role: 'admin'
                };
                await expect(UserService.create(invalidUser)).rejects.toThrow(InvalidParamError);
                });
});

describe('readAll', () => {
    test('usuários disponíveis ==> retorna todos os usuários', async () => {
        const user = [{
            id: 1,
            name: 'user',
            email: 'email@.com',
            photo: 'urlphoto',
            password: 'encrypted',
            role: 'user'
        }];
      prismaMock.user.findMany.mockResolvedValue(user);
      await expect(UserService.readAll()).resolves.toEqual(user);
    });

    test('nenhum usuário disponível ==> lança Query error', async () => {
        prismaMock.user.findMany.mockResolvedValue(null);
        await expect(UserService.readAll()).rejects.toThrow(QueryError);
    });
  });

  describe('readById', () => {
    test('ID válido fornecido ==> retorna usuário correspondente', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' };
      prismaMock.user.findUnique.mockResolvedValue(user);
      await expect(UserService.readById(1)).resolves.toEqual(user);
    });

    test('ID não fornecido ==> lança InvalidParamError', async () => {
      await expect(UserService.readById(null as any)).rejects.toThrow(InvalidParamError);
    });

    test('usuário não encontrado por ID ==> lança QueryError', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(UserService.readById(1)).rejects.toThrow(QueryError);
    });
});

describe('update', () => {
    test('dados válidos fornecidos ==> atualiza o user', async () => {
        const user = {id:1 ,name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' };

      prismaMock.user.findUnique.mockResolvedValue(user);
      await expect(UserService.update(1, { name: 'Joao', email: 'ph@.com', photo: 'url-photo', password: 'encrypted123', role: 'user' })).resolves.toEqual(user);
    });

    test('ID não fornecido ==> lança InvalidParamError', async () => {
      await expect(UserService.update(null as any, { name: 'user' })).rejects.toThrow(InvalidParamError);
    });

    test('user não encontrado ==> lança QueryError', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(UserService.update(1, { name: 'New User Name' })).rejects.toThrow(QueryError);
    });

    test('nenhuma atualização fornecida ==> lança InvalidParamError', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' });
      await expect(UserService.update(1, {})).rejects.toThrow(InvalidParamError);
    });

    test('dados de atualização inválidos fornecidos ==> lança InvalidParamError', async () => {
        const invalidUser = {
            id: 1,
            name: 1234, //Deveria ser uma string
            email: 'email@.com',
            photo: null,
            role: 'user'
          };

      prismaMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' });
      await expect(UserService.update(1, invalidUser as any)).rejects.toThrow(InvalidParamError);
    });

    test('tenta atualizar o role ==> lança InvalidParamError', async () => {
        const invalidUser = {
            id: 1,
            name: 'Joao',
            email: 'email@.com',
            photo: null,
            role: 'admin'
          };

      prismaMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' });
      await expect(UserService.update(1, invalidUser)).rejects.toThrow(InvalidParamError);
    });
  });

  describe('delete', () => {
    test('ID válido fornecido ==> deleta o user', async () => {
        const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' };

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.delete.mockResolvedValue(user);

      await expect(UserService.delete(1)).resolves.toEqual(user);
    });

    test('ID não fornecido ==> lança InvalidParamError', async () => {
      await expect(UserService.delete(null as any)).rejects.toThrow(InvalidParamError);
    });

    test('user não encontrado ==> lança QueryError', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(UserService.delete(1)).rejects.toThrow(QueryError);
    });
  });

  describe('updateRole', () => {
    test('dados válidos fornecidos ==> atualiza o role', async () => {
        const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue(user);
      await expect(UserService.updateRole(1, { role: 'admin' })).resolves.toEqual(user);
    });

    test('ID não fornecido ==> lança InvalidParamError', async () => {
      await expect(UserService.updateRole(null as any, { role: 'admin' })).rejects.toThrow(InvalidParamError);
    });

    test('user não encontrado ==> lança QueryError', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(UserService.updateRole(1, { name: 'Joao' })).rejects.toThrow(QueryError);
    });

    test('nenhuma atualização fornecida ==> lança InvalidParamError', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' });
      await expect(UserService.update(1, {})).rejects.toThrow(InvalidParamError);
    });

    test('dados de atualização inválidos fornecidos ==> lança InvalidParamError', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' });
      await expect(UserService.update(1, {role:'idkidk'})).rejects.toThrow(InvalidParamError);
    });
  });

  describe('updatePassword', () => {
    test('dados válidos fornecidos ==> atualiza a senha', async () => {
        const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue(user);
      await expect(UserService.updatePassword(1, { password: 'admin123' })).resolves.toEqual(user);
    });

    test('ID não fornecido ==> lança InvalidParamError', async () => {
      await expect(UserService.updatePassword(null as any, { password: 'admin123' })).rejects.toThrow(InvalidParamError);
    });

    test('user não encontrado ==> lança QueryError', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(UserService.updatePassword(1, { password: 'Joao123' })).rejects.toThrow(QueryError);
    });

    test('nenhuma atualização fornecida ==> lança InvalidParamError', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' });
      await expect(UserService.update(1, {})).rejects.toThrow(InvalidParamError);
    });

    test('tenta atualizar senha <6 ==> lança InvalidParamError', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' });
      await expect(UserService.update(1, {password:'senha'})).rejects.toThrow(InvalidParamError);
    });
  });

  describe('addMusicToUser', () => {
    test('tenta adicionar uma música corretamente ==> adiciona música', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' };
      const music = { id: 1,  name: 'One Dance', genre:'pop', album: 'body.album', authorId: 1}
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.music.findUnique.mockResolvedValue(music);
      prismaMock.user.update.mockResolvedValue(user);

      await expect(UserService.addMusicToUser(1,1)).resolves.toEqual(user);
    });

    test('tenta adicionar uma música com dados inválidos ==> lança invalid params error', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' };
      const music = { id: 1,  name: 'One Dance', genre:'pop', album: 'body.album', authorId: 1};
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.music.findUnique.mockResolvedValue(music);

      await expect(UserService.addMusicToUser(null as any, 1)).rejects.toThrow(InvalidParamError);    
    });

    test('Música não existe ==> lança querry error', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user' };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.music.findUnique.mockResolvedValue(null);
      
      await expect(UserService.addMusicToUser(1, 1)).rejects.toThrow(QueryError);    
    });

    test('Usuário não existe ==> lança querry error', async () => {
      const music = { id: 1,  name: 'One Dance', genre:'pop', album: 'body.album', authorId: 1}
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.music.findUnique.mockResolvedValue(music);

      await expect(UserService.addMusicToUser(1, 1)).rejects.toThrow(QueryError);    
    });
  });

  describe('removeMusicFromUser', () => {
    test('tenta remover uma música corretamente ==> remove música', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user', musics:[{ id: 1,  name: 'One Dance', genre:'pop', album: 'body.album', authorId: 1}] };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue(user);

      await expect(UserService.removeMusicFromUser(1,1)).resolves.toEqual(user);
    });

    test('tenta remover uma música com dados inválidos ==> lança invalid params error', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user', musics:[{ id: 1,  name: 'One Dance', genre:'pop', album: 'body.album', authorId: 1}] };      
      prismaMock.user.findUnique.mockResolvedValue(user);

      await expect(UserService.removeMusicFromUser(null as any, 1)).rejects.toThrow(InvalidParamError);    
    });

    test('Usuário não existe ==> lança querry error', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(UserService.removeMusicFromUser(1, 1)).rejects.toThrow(QueryError);    
    });

    test('Música não existe no usuário ==> lança querry error', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user'};
      prismaMock.user.findUnique.mockResolvedValue(user);

      await expect(UserService.removeMusicFromUser(1, 1)).rejects.toThrow(QueryError);    
    });
  });

  describe('musicsListenByUser', () => {
    test('tenta listar as músicas corretamente ==> lista as músicas', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user', musics:[{ id: 1,  name: 'One Dance', genre:'pop', album: 'body.album', authorId: 1}] };      
      prismaMock.user.findUnique.mockResolvedValue(user);
      await expect(UserService.musicsListenByUser(1)).resolves.toEqual(user.musics);
    });

    test('tenta listar músicas com dados inválidos ==> lança invalid params error', async () => {
      const user = { id: 1, name: 'Pedro', email: 'jh@.com', photo: 'url-photo', password: 'encrypted', role: 'user', musics:[{ id: 1,  name: 'One Dance', genre:'pop', album: 'body.album', authorId: 1}] };      
      prismaMock.user.findUnique.mockResolvedValue(user);

      await expect(UserService.musicsListenByUser(null as any)).rejects.toThrow(InvalidParamError);    
    });

    test('Usuário não existe ==> lança querry error', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(UserService.musicsListenByUser(1)).rejects.toThrow(QueryError);    
    });
  });
});
