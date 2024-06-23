import { Router, Request, Response, NextFunction } from "express";
import MusicService from '../services/MusicServices';
import statusCodes from '../../../../utils/constants/statusCodes';
import { checkRole, verifyJWT } from '../../../middlewares/auth';

const router = Router();

// Instância do MusicService
const musicService = new MusicService();

// Cria uma nova música
router.post("/create", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createMusic = await musicService.create(req.body);
            res.status(statusCodes.CREATED).json(createMusic);
        } catch (error) {
            next(error);
        }
    });

// Lista todas as músicas
router.get("/", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['user','admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getMusics = await musicService.readAll();
            res.status(statusCodes.SUCCESS).json(getMusics);
        } catch (error) {
            next(error);
        }
    });

// Lista uma música por ID
router.get("/:id", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['user','admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getMusicById = await musicService.readById(Number(req.params.id));
            if(!getMusicById){
                res.status(statusCodes.NOT_FOUND).json({message: "Música não encontrada"});
            }
            res.status(statusCodes.SUCCESS).json(getMusicById);
        } catch (error) {
            next(error);
        }
    });


// Atualiza uma música pelo ID
router.put("/update/:id", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updateMusic = await musicService.update(Number(req.params.id), req.body);
            if(!updateMusic){
                res.status(statusCodes.NOT_FOUND).json({message: "Música não encontrada"});
            }
            res.status(statusCodes.SUCCESS).json(updateMusic);
        } catch (error) {
            next(error);
        }
    });

// Deleta uma música pelo ID 
router.delete("/delete/:id", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deleteMusic = await musicService.delete(Number(req.params.id));
            if(!deleteMusic){
                res.status(statusCodes.NOT_FOUND).json({message: "Música não encontrada"});
            }
            res.status(statusCodes.SUCCESS).json(deleteMusic);
        } catch (error) {
            next(error);
        }
    });

// Lista os usuários que já ouviram determinada música
router.get("/:id/users", verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const musicId = Number(req.params.id);
            const usersByMusic = await musicService.userWhoListenedMusic(musicId);
            res.status(statusCodes.SUCCESS).json(usersByMusic);
        } catch (error) {
            next(error);
        }
    });

export default router;