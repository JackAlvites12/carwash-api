import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.model";

export const superAdminMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {

    try {

        const { userId } = req.cookies
        
        const user = await User.findById( userId )

        if( !user ) return res.status( 401 ).json({ message: 'Acceso denegado' })

        if( !user.rol?.includes('superAdmin')) return res.status( 401 ).json({ message: 'Acceso denegado' })
        
        next()
        

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error inesperado en el servidor, inténtelo más tarde.' })

    }

}