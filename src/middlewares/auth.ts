import prisma from '../../config/prismaClient'
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { PermissionError } from '../../errors/PermissionError';
import { compare } from 'bcrypt';
import statusCodes from '../../utils/constants/statusCodes';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { TokenError } from '../../errors/TokenError';
import { userRoles } from '../../utils/constants/userRoles';
import { NotAuthorizedError } from '../../errors/NotAuthorizedError';

// Gera um token JWT para um usuário autenticado 
function generateJWT(user: User, res: Response){
    // Criação do corpo do token com informações do usuário
    const body = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
    };

    // Gera o token JWT com as informações do usuário e uma chave secreta
    const token = sign({ user: body }, process.env.SECRET_KEY || "", { expiresIn: process.env.JWT_EXPIRATION });

    // Define o token JWT como um cookie HTTP na resposta
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development"
    });
}

// Extrai o token JWT do cookie HTTP da solicitação
function cookieExtractor(req: Request){
    let token = null;
    if(req.cookies){
        token = req.cookies["jwt"];
    }
    return token;
}

// Verifica se o token JWT está presente na solicitação e, se estiver, verifica se é válido
export function verifyJWT(req: Request, res: Response, next: NextFunction){
    try {
        // Extrai o token JWT do cookie HTTP da requisição
        const token = cookieExtractor(req);
        if(token){
            // Verifica se o token JWT é válido e decodifica suas informações
            const decoded = verify(token, process.env.SECRET_KEY || "") as JwtPayload;
            // Define req.user com as informações do usuário contidas no token
            req.user = decoded.user;
        }
        // Se não houver usuário, lança um erro de token
        if(req.user == null){
            throw new TokenError("Você precisa estar logado para realizar essa ação!");
        }
        next();
    } catch (error) {
        next(error);
    }
}

// Responsável pelo processo de login do usuário
export async function login(req: Request, res: Response, next: NextFunction){
    try {
        // Busca o usuário no banco de dados pelo e-mail fornecido na requisição
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        });

        // Se o usuário não existir, lança um erro de permissão
        if(!user){
            throw new PermissionError("Email e/ou senha incorretos!");
        }

        // Compara a senha fornecida na requisição com a senha armazenada no banco de dados
        const match = compare(req.body.password, user.password);

        // Se as senhas não corresponderem, lança um erro de permissão
        if(!match){
            throw new PermissionError("Email e/ou senha incorretos!");
        }

        // Se o login for bem-sucedido, gera um token JWT para o usuário e o envia como cookie HTTP na resposta
        generateJWT(user, res);

        // Retorna uma resposta de sucesso com status 204 No Content
        res.status(statusCodes.SUCCESS).json("Login realizado com sucesso!");
    } catch (error) {
        next(error);
    }
}

export function checkRole(req: Request, res: Response, next: NextFunction, roles: string[]){
    try {
        const allowed = roles.some(role => req.user.role === role);
        
        if(!allowed){
            throw new NotAuthorizedError("Você não é autorizado a realizar essa ação!")
        }

        next();
    } catch (error) {
        next(error);
    }
}