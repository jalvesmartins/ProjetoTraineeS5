import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import ArtistRouter from "../src/domains/artist/controllers";
import AdminRouter from "../src/domains/user/controllers/adminIndex";
import UserRouter from "../src/domains/user/controllers/userIndex";
import MusicRouter from "../src/domains/music/controllers";
import cookieParser = require("cookie-parser");

dotenv.config();

export const app: Express = express();

const options: CorsOptions = {
	credentials: true,
	origin: process.env.APP_URL
};

app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implementar rotas
app.use("/api/artist", ArtistRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/music", MusicRouter);
app.use("/api/users", UserRouter);
