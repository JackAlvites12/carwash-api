import { Request, Response } from "express";
import { Movement } from "../models/Movement.model";

export const getAllMovements = async ( req: Request, res: Response ) => {

    try {
        
        const movements = await Movement.find().populate('productId').sort({ createdAt :-1 })
        // .populate('productId').populate({ path: 'referenceId', model: 'Sale' })

        return res.status( 200 ).json( movements )


    } catch (error) {
        
        console.log( error );
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}
