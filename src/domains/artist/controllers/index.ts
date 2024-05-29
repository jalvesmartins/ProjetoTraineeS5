import { Router, Request, Response, NextFunction } from 'express';
import ArtistService from '../services/ArtistServices';

const router = Router();
const artistService = new ArtistService();

// Rota para criar um novo artista
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist = await artistService.create(req.body);
        res.json(artist);
    } catch (error) {
        next(error);
    }
});

// Rota para retornar todos os artistas
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artists = await artistService.readAll();
        res.json(artists);
    } catch (error) {
        next(error);
    }

});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist = await artistService.update(Number(req.params.id), req.body);
        res.json(artist);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist = await artistService.delete(Number(req.params.id));
        res.json(artist);
    } catch (error) {
        next(error);
    }
});

export default router; 