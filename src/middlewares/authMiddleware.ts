import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {

    try {
        
        const { token } = req.cookies

        if( !token ) return res.status( 401 ).json({ message: 'Tienes que iniciar sesión o registrarte para poder continuar.' })

        const decode = jwt.verify( token, process.env.TOKEN_SECRET_KEY as string )
        next()

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error inesperado en el servidor, inténtelo más tarde.' })
        
    }

}
