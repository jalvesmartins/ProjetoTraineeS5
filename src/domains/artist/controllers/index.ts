import { Router, Request, Response, NextFunction } from 'express';
import ArtistService from '../services/ArtistServices';

const router = Router();
const artistService = new ArtistService();

// Rota para criar um novo artista
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist = await artistService.create(req.body);
        res.status(201).json(artist);
    } catch (error) {
        next(error);
    }
});

export default router; 