/* eslint-disable indent */
import { Router, Request, Response, NextFunction } from "express";
import UserService from "../../user/services/UserService";
import { login } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";


const router = Router();

//Rota para realizar o login
router.post("/login", login); //implementar rota

//Lista todos os usuários
router.get("/", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const getUsers = await UserService.readAll();
		res.status(statusCodes.SUCCESS).json(getUsers);
	} catch (error) {
		next(error);
	}
});

//Lista usuários por ID
router.get("/:id", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const getUserById = await UserService.readById(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(getUserById);
	} catch (error) {
		next(error);
	}
});

//Cria um usuário
router.post("/create", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const createUser = await UserService.create(req.body);
		res.status(statusCodes.CREATED).json(createUser);
	} catch (error) {
		next(error);
	}
});

//Atualiza um usuário pelo ID
router.put("/update/:id", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const updateUser = await UserService.update(Number(req.params.id), req.body);
		res.status(statusCodes.SUCCESS).json(updateUser);
	} catch (error) {
		next(error);
	}
});

//Deleta um usuário pelo ID
router.delete("/delete/:id", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const deleteUser = await UserService.delete(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(deleteUser);
	} catch (error) {
		next(error);
	}
});

//Lista as músicas do User
router.get("/musics/:id", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const userId = Number(req.params.id);

		const getUserMusic = await UserService.musicsListenByUser(userId);
		res.status(statusCodes.SUCCESS).json(getUserMusic);
	} catch (error) {
		next(error);
	}
});

//Adiciona uma música ao usuário
router.put("/musics/add/:id", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const userId = Number(req.params.id);
        const { musicId } = req.body; 

		const addUserMusic = await UserService.addMusicToUser(userId, Number(musicId));
		res.status(statusCodes.SUCCESS).json(addUserMusic);
	} catch (error) {
		next(error);
	}
});

//Deleta uma música de um usuário
router.delete("/musics/delete/:id", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const userId = Number(req.params.id);
		const { musicId } = req.body; 

		const deleteUserMusic = await UserService.removeMusicFromUser(userId, Number(musicId));
		res.status(statusCodes.SUCCESS).json(deleteUserMusic);
	} catch (error) {
		next(error);
	}
});

export default router; 