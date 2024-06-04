import { User } from '.prisma/client';
import prisma from '../../../../config/prismaClient'
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from '../../../../errors/QueryError';

class ServiceUser {
	//Cria um usuário
	async create(body: User) {
		const checkUser = await prisma.user.findUnique({
			where: {
				email: body.email
			}
		});
		if(body.email == null){
			throw new InvalidParamError("Email não informado.");
		}
		if(checkUser){
			throw new QueryError("Esse email já esta cadastrado.");
		}
		if(body.password.length<6){
			throw new InvalidParamError("Senha menor que o exigido. Mínimo de 6 dígitos");
		}
		const createUser = await prisma.user.create({
			data: {
				name: body.name,
				email: body.email,
				photo: body.photo,
				password: body.password,
				role: body.role
			}
		});
		return createUser;
	}

	//Retorna todos os usuários
	async readAll() {
		const readUser = await prisma.user.findMany({
			orderBy: {
				name:"asc"
			}
		});
		if(!readUser){
			throw new QueryError("Nenhum usuário cadastrado");
		}
		return readUser;
	}

	//Retorna um usuário pelo ID
	async readById(id: number) {
		if(!id){
			throw new InvalidParamError("Informe um Id de usuário");
		}
		const readUserId = await prisma.user.findUnique({
			where: { id: id }
		});
		if(!readUserId){
			throw new QueryError("Id de usuário inexistente e/ou inválido");
		}
		return readUserId;
	}

	//Atualiza um usuário pelo ID
	async update(id: number, body: Partial<User>) {
		if(!id){
			throw new InvalidParamError("Informe um Id de usuário.");
		}
		const updateData = {
			...(body.name && { name: body.name }),
			...(body.email && { email: body.email }),
			...(body.photo && { photo: body.photo }),
			...(body.password && { password: body.password }),
			...(body.role && { role: body.role }),
		};
		const checkUser = await prisma.user.findUnique({
			where: {
				email: body.email
			}
		});
		//Autenticações das excessões
		if(!updateData){
			throw new InvalidParamError("Informe os dados de atualização");
		}
		if(body.email == null || checkUser){
			throw new InvalidParamError("Email inválido e/ou já cadastrado.");
		}
		if(body.password != undefined && body.password.length<6){
			throw new InvalidParamError("Senha menor que o exigido. Mínimo de 6 dígitos");
		}
		const updatedUser = await prisma.user.update({
			where: { id: id },
			data: updateData
		});
		const user = await prisma.user.findUnique({
			where: { id: id },
		});
		return user;
	}

	//Deleta um usuário pelo ID
	async delete(id: number) {
		if(!id){
			throw new InvalidParamError("Informe um Id de usuário");
		}
		const deletedUser = await prisma.user.findUnique({
			where: { id: id }
		});
		if(!deletedUser){
			throw new QueryError("Usuário inválido e/ou inexistente");
		}
		const userDelete = await prisma.user.delete({
			where: { id: id }
		});
		return deletedUser;
	}

	//Adiciona música a um usuário
	async addMusicToUser(userId: number, musicId: number) {
		if(!userId || !musicId){
			throw new InvalidParamError("Informe um Id de usuário e/ou Id da música");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});
		if(!checkUser){
			throw new QueryError("Usuário inválido e/ou inexistente");
		}
		const checkMusic = await prisma.user.findUnique({
			where: {
				id: musicId
			}
		});
		if(!checkMusic){
			throw new QueryError("Música inválida e/ou inexistente");
		}
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				musics: {
					connect: { id: musicId },
				},
			},
			include: { musics: true },
		});
		return updatedUser;
	}
        
	//Remove uma música de um usuário 
	async removeMusicFromUser(userId: number, musicId: number) {
		if(!userId || !musicId){
			throw new InvalidParamError("Informe um Id de usuário e/ou Id da música");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});
		if(!checkUser){
			throw new QueryError("Usuário inválido e/ou inexistente");
		}
		const checkMusic = await prisma.user.findUnique({
			where: {
				id: musicId
			}
		});
		if(!checkMusic){
			throw new QueryError("Música inválida e/ou inexistente");
		}
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				musics: {
					disconnect: { id: musicId },
				},
			},
			include: { musics: true },
		});
		if(!updatedUser){
			throw new QueryError("Essa música não esta atrelada ao usuário");
		}
		return updatedUser;
	}

	//Lista as músicas já escutadas por determinado usuário
	async musicsListenByUser(userId: number){
		if(!userId){
			throw new InvalidParamError("Informe um Id de usuário");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});
		if(!checkUser){
			throw new QueryError("Usuário inválido e/ou inexistente");
		}
		const musicsByUser = await prisma.user.findUnique({
			where:{ id: userId },
			select:{ musics: true }
		});
		if(!musicsByUser){
			throw new QueryError("Nenhuma música ouvida pelo usuário");
		}
		return musicsByUser;
	}
}

export default new ServiceUser();