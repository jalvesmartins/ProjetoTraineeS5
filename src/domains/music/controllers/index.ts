import { Router, Request, Response, NextFunction } from "express";
import MusicService from '../services/MusicServices';

const router = Router();

// Instância do MusicService
const musicService = new MusicService();

// Lista todas as músicas
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getMusics = await musicService.readAll();
        res.json(getMusics);
    } catch (error) {
        next(error);
    }
});

// Lista uma música por ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getMusicById = await musicService.readById(Number(req.params.id));
        res.json(getMusicById);
    } catch (error) {
        next(error);
    }
});

// Cria uma nova música
router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createMusic = await musicService.create(req.body);
        res.json(createMusic);
    } catch (error) {
        next(error);
    }
});

// Atualiza uma música pelo ID
router.put("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateMusic = await musicService.update(Number(req.params.id), req.body);
        res.json(updateMusic);
    } catch (error) {
        next(error);
    }
});

// Deleta uma música pelo ID
router.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleteMusic = await musicService.delete(Number(req.params.id));
        res.json(deleteMusic);
    } catch (error) {
        next(error);
    }
});

// Lista os usuários que já ouviram determinada música
router.get("/:id/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const musicId = Number(req.params.id);
        const usersByMusic = await musicService.userWhoListenedMusic(musicId);
        res.json(usersByMusic);
    } catch (error) {
        next(error);
    }
});

export default router;