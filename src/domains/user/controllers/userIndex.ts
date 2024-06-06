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

export default router; 