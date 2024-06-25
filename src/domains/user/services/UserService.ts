import { User } from '.prisma/client';
import prisma from '../../../../config/client'
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from '../../../../errors/QueryError';
import bcrypt from "bcrypt";

class ServiceUser {
	async encryptPassword(password: string){
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	
	async create(body: User) {
		if(body.email == null || body.email == undefined){
			throw new InvalidParamError("Email não informado.");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				email: body.email
			}
		});
		if(checkUser){
			throw new QueryError("Esse email já esta cadastrado.");
		}
		if(body.password.length<6){
			throw new InvalidParamError("Senha menor que o exigido. Mínimo de 6 dígitos");
		}
		if(body.role == "admin"){
			throw new InvalidParamError("Você não tem permissão para criar uma conta admin, insira o role de user");
		}

		const encrypted = await this.encryptPassword(body.password);

		const createUser = await prisma.user.create({
			data: {
				name: body.name,
				email: body.email,
				photo: body.photo,
				password: encrypted,
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
		if(body == null){
			throw new InvalidParamError("Informe os dados de atualização");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				id: id
			}
		});
		if(!checkUser){
			throw new InvalidParamError("Id de usuário inexistente e/ou inválido");
		}
		const updateData = {
			...(body.name && { name: body.name }),
			...(body.email && { email: body.email }),
			...(body.photo && { photo: body.photo }),
		};
		//Autenticações das excessões
		if (Object.keys(updateData).length === 0) {
			throw new InvalidParamError("Nenhuma atualização foi fornecida");
		}
		if(body.email === null){
			throw new InvalidParamError("Email inválido");
		}
		if(body.email != undefined){
			const checkEmail = await prisma.user.findUnique({
				where: {
					email: body.email
				}
			});
			if(checkEmail){
				throw new InvalidParamError("Email inválido e/ou já cadastrado.");
			}
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

	async updateRole(id: number, body: Partial<User>) {
		if(!id){
			throw new InvalidParamError("Informe um Id de usuário.");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				id: id
			}
		});
		if(!checkUser){
			throw new InvalidParamError("Id de usuário inexistente e/ou inválido");
		}
		const updateData = {
			...(body.role && { role: body.role }),
		};
		//Autenticações das excessões
		if (Object.keys(updateData).length === 0) {
			throw new InvalidParamError("Nenhuma atualização foi fornecida");
		}
		if(body.role === null){
			throw new InvalidParamError("Role inválido");
		}
		const roleData = String(updateData);
		const updatedUser = await prisma.user.update({
			where: { id: id },
			data: {
				role: roleData
			}
		});
		const user = await prisma.user.findUnique({
			where: { id: id },
		});
		return user;
	}

	async updatePassword(id: number, body: Partial<User>) {
		if(!id){
			throw new InvalidParamError("Informe um Id de usuário.");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				id: id
			}
		});
		if(!checkUser){
			throw new InvalidParamError("Id de usuário inexistente e/ou inválido");
		}
		const updateData = {
			...(body.password && { password: body.password }),
		};
		//Autenticações das excessões
		if (Object.keys(updateData).length === 0) {
			throw new InvalidParamError("Nenhuma atualização foi fornecida");
		}
		if(body.password === null){
			throw new InvalidParamError("Senha inválida");
		}
		if(body.password != undefined && body.password.length<6){
			throw new InvalidParamError("Senha menor que o exigido. Mínimo de 6 dígitos");
		}

		const encrypted = await this.encryptPassword(String(updateData));

		const updatedUser = await prisma.user.update({
			where: { id: id },
			data: {
				password: encrypted
			}
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

	// Adiciona música a um usuário
	async addMusicToUser(userId: number, musicId: number) {
		if (!userId) {
			throw new InvalidParamError("Informe um Id de usuário");
		}
		if (!musicId) {
			throw new InvalidParamError("Informe um Id de música");
		}
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { musics: true },
		});
		if (!user) {
			throw new QueryError("Usuário inválido e/ou inexistente");
		}
		const music = await prisma.music.findUnique({
			where: { id: musicId },
		});
		if (!music) {
			throw new QueryError("Música inválida e/ou inexistente");
		}
		if (user.musics.some(m => m.id === musicId)) {
			throw new InvalidParamError("A música já está marcada como ouvida");
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
        
	// Remove uma música de um usuário 
	async removeMusicFromUser(userId: number, musicId: number) {
		if (!userId) {
			throw new InvalidParamError("Informe um Id de usuário");
		}
		if (!musicId) {
			throw new InvalidParamError("Informe um Id de música");
		}
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { musics: true },
		});
		if (!user) {
			throw new QueryError("Usuário inválido e/ou inexistente");
		}
		const music = await prisma.music.findUnique({
			where: { id: musicId },
		});
		if (!music) {
			throw new QueryError("Música inválida e/ou inexistente");
		}
		if (!user.musics.some(m => m.id === musicId)) {
			throw new InvalidParamError("A música não está marcada como ouvida");
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
		return musicsByUser;
	}
}

export default new ServiceUser();