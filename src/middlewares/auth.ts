import prisma from '../../config/prismaClient'
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { PermissionError } from '../../errors/PermissionError';
import { compare } from 'bcrypt';
import statusCodes from '../../utils/constants/statusCodes';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { TokenError } from '../../errors/TokenError';

function generateJWT(user: User, res: Response){
    const body = {
        id:user.id,
        email: user.email,
        role: user.role,
        name: user.name
    };

    const token = sign({user: body}, process.env.SECRET_KEY || "", {expiresIn: process.env.JTW_EXPIRATION});

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development"
    });
}

function cookieExtrator(req: Request){
    let token = null;
    if(req.cookies){
        token = req.cookies["jwt"];
    }
    return token;
}

export function verifyJWT(req: Request, res: Response, next: NextFunction){
    try {
        const token = cookieExtrator(req);
        if(token){
            const decoded = verify(token, process.env.SECRET_KEY || "") as JwtPayload;
            req.user = decoded.user;
        }
        if(req.user == null){
            throw new TokenError("Você precisa estar logado para realizar essa ação!");
        }
        next();
    } catch (error) {
        next(error);
    }
}
