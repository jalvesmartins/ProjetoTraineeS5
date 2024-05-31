import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import ArtistRouter from '../src/domains/artist/controllers';
import UserRouter from "../src/domains/user/controllers/index";

dotenv.config();

export const app: Express = express();

const options: CorsOptions = {
    credentials: true,
    origin: process.env.APP_URL
};

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implementar rotas
app.use('/api/artist', ArtistRouter);
app.use("/api/users", UserRouter);
