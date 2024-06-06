import { Router, Request, Response, NextFunction } from 'express';
import ArtistService from '../services/ArtistServices';
import statusCodes from '../../../../utils/constants/statusCodes';
import { checkRole, verifyJWT } from '../../../middlewares/auth';

const router = Router();
const artistService = new ArtistService();

// Rota para criar um novo artista
router.post('/', verifyJWT, (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const artist = await artistService.create(req.body);
            res.status(statusCodes.CREATED).json(artist);
        } catch (error) {
            next(error);
        }
    }
);

// Rota para retornar todos os artistas
router.get('/', verifyJWT, (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['user','admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const artists = await artistService.readAll();
            res.status(statusCodes.SUCCESS).json(artists);
        } catch (error) {
            next(error);
        }
    });

//Rota para retornar um artista por ID
router.get('/:id', verifyJWT, (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['user','admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const artist = await artistService.readById(Number(req.params.id));
            if(!artist){
                res.status(statusCodes.NOT_FOUND).json({message: "Artista não encontrado"});
            }
            res.status(statusCodes.SUCCESS).json(artist);
        } catch (error) {
            next(error);
        }
});

// Rota para atualizar um artista por ID
router.put('/:id', verifyJWT, (req: Request, res: Response, next: NextFunction) => {
        checkRole(req, res, next, ['admin']);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const artist = await artistService.update(Number(req.params.id), req.body);
            if(!artist){
                res.status(statusCodes.NOT_FOUND).json({message: "Artista não encontrado"});
            }
            res.status(statusCodes.SUCCESS).json(artist);
        } catch (error) {
            next(error);
        }
});

// Rota para deletar um artista por ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist = await artistService.delete(Number(req.params.id));
        if(!artist){
            res.status(statusCodes.NOT_FOUND).json({message: "Artista não encontrado"});
        }
        res.status(statusCodes.SUCCESS).json(artist);
    } catch (error) {
        next(error);
    }
});

export default router; 