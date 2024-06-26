/* eslint-disable indent */
import { Router, Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";
import { checkRole, login, logout, verifyJWT } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";


const router = Router();

//Lista todos os usuários
router.get("/", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
		checkRole(req, res, next, ["admin"]);
	},
	async (req, res, next) => {
	try {
		const getUsers = await UserService.readAll();
		res.status(statusCodes.SUCCESS).json(getUsers);
	} catch (error) {
		next(error);
	}
	}
);

//Lista usuários por ID
router.get("/:id", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
		checkRole(req, res, next, ["admin"]);
},
	async (req, res, next) => {
	try {
		const getUserById = await UserService.readById(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(getUserById);
	} catch (error) {
		next(error);
	}
	}
);

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
router.put("/:id/update", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
		checkRole(req, res, next, ["admin"]);
	},
	async (req, res, next) => {
	try {
		const updateUser = await UserService.update(Number(req.params.id), req.body);
		res.status(statusCodes.SUCCESS).json(updateUser);
	} catch (error) {
		next(error);
	}
	}
);

//Atualiza o role de um usuário
router.put("/:id/update/role", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin"]);
},
async (req, res, next) => {
try {
	const updateUser = await UserService.updateRole(Number(req.params.id), req.body);
	res.status(statusCodes.SUCCESS).json(updateUser);
} catch (error) {
	next(error);
}
}
);

router.put("/:id/update/password", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin"]);
},
async (req, res, next) => {
	try {
		const updateUser = await UserService.updatePassword(Number(req.params.id), req.body);
		res.status(statusCodes.SUCCESS).json(updateUser);
	} catch (error) {
		next(error);
	}
}
);

//Deleta um usuário pelo ID
router.delete("/:id/delete", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
		checkRole(req, res, next, ["admin"]);
	},
	async (req, res, next) => {
	try {
		const deleteUser = await UserService.delete(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(deleteUser);
	} catch (error) {
		next(error);
	}
	}
);

//Lista as músicas do User
router.get("/:id/musics", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
		checkRole(req, res, next, ["admin"]);
	},
	async (req, res, next) => {
	try {
		const userId = Number(req.params.id);

		const getUserMusic = await UserService.musicsListenByUser(userId);
		res.status(statusCodes.SUCCESS).json(getUserMusic);
	} catch (error) {
		next(error);
	}
	}
);

//Adiciona uma música ao usuário
router.put("/:id/musics/add", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
		checkRole(req, res, next, ["admin"]);
	},
	async (req, res, next) => {
	try {
		const userId = Number(req.params.id);
        const { musicId } = req.body; 

		const addUserMusic = await UserService.addMusicToUser(userId, Number(musicId));
		res.status(statusCodes.SUCCESS).json(addUserMusic);
	} catch (error) {
		next(error);
	}
	}
);

//Deleta uma música de um usuário
router.delete("/:id/musics/delete", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
		checkRole(req, res, next, ["admin"]);
	},
	async (req, res, next) => {
	try {
		const userId = Number(req.params.id);
		const { musicId } = req.body; 
		const deleteUserMusic = await UserService.removeMusicFromUser(userId, Number(musicId));
		res.status(statusCodes.SUCCESS).json(deleteUserMusic);
	} catch (error) {
		next(error);
	}
	}
);

export default router; 