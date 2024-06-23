import { Router, Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";
import { checkRole, login, logout, verifyJWT } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";

const router = Router();

router.post("/login", login);

router.post("/logout", verifyJWT, logout);

//Cria um usuário
router.post("/create", async (req: Request, res: Response, next:NextFunction) => {
	try {
		const createUser = await UserService.create(req.body);
		res.status(statusCodes.CREATED).json(createUser);
	} catch (error) {
		next(error);
	}
}
);

router.get("/account", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin", "user"]);
},
async (req, res, next) => {
	try {
		const getUserById = await UserService.readById(Number(req.user.id));
		res.status(statusCodes.SUCCESS).json(getUserById);
	} catch (error) {
		next(error);
	}
}
);

router.put("/account/update", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin", "user"]);
},
async (req, res, next) => {
	try {
		const updateUser = await UserService.update(Number(req.user.id), req.body);
		res.status(statusCodes.SUCCESS).json(updateUser);
	} catch (error) {
		next(error);
	}
}
);

router.put("/account/update/password", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin", "user"]);
},
async (req, res, next) => {
	try {
		const updateUser = await UserService.updatePassword(Number(req.user.id), req.body);
		res.status(statusCodes.SUCCESS).json(updateUser);
	} catch (error) {
		next(error);
	}
}
);

router.delete("/account/delete", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin", "user"]);
},
async (req, res, next) => {
	try {
		const deleteUser = await UserService.delete(Number(req.user.id));
		res.status(statusCodes.SUCCESS).json(deleteUser);
	} catch (error) {
		next(error);
	}
}
);

//Lista as músicas do User
router.get("/account/musics", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin", "user"]);
},
async (req, res, next) => {
	try {
		const userId = Number(req.user.id);
		const getUserMusic = await UserService.musicsListenByUser(userId);
		res.status(statusCodes.SUCCESS).json(getUserMusic);
	} catch (error) {
		next(error);
	}
}
);

//Adiciona uma música ao usuário
router.put("/account/musics/listen", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin", "user"]);
},
async (req, res, next) => {
	try {
		const userId = Number(req.user.id);
		const { musicId } = req.body; 
		const addUserMusic = await UserService.addMusicToUser(userId, Number(musicId));
		res.status(statusCodes.SUCCESS).json(addUserMusic);
	} catch (error) {
		next(error);
	}
}
);

//Deleta uma música de um usuário
router.delete("/account/musics/unlisten", verifyJWT, (req: Request, res: Response, next:NextFunction) => {
	checkRole(req, res, next, ["admin", "user"]);
},
async (req, res, next) => {
	try {
		const userId = Number(req.user.id);
		const { musicId } = req.body; 
		const deleteUserMusic = await UserService.removeMusicFromUser(userId, Number(musicId));
		res.status(statusCodes.SUCCESS).json(deleteUserMusic);
	} catch (error) {
		next(error);
	}
}
);


export default router; 