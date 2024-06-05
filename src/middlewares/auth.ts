import prisma, { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { PermissionError } from '../../errors/PermissionError';
import { compare } from 'bcrypt';
import statusCodes from '../../utils/constants/statusCodes';
import { sign } from 'jsonwebtoken';

function genarateJWT(user: User, res: Response){
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