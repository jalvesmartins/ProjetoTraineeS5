import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }

    namespace NodeJS {
        interface ProcessEnv {
            APP_URL: string;
            PORT: number;
            DATABASE_URL: string;
            SECRET_KEY: string;
            JTW_EXPIRATION: string;
            NODE_ENV: string;
        }
    }
}