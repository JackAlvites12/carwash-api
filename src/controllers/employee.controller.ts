import { Request, Response } from "express";
import { Employee } from "../models/Employee.model";

export const getAllEmployees = async ( req: Request, res: Response ) => {
 
    try {
        
        const employees = await Employee.find()

        if( !employees ) return res.status( 400 ).json([])

        return res.status( 200 ).json( employees )

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }
    
}

export const createEmployee = async ( req: Request, res: Response ) => {

    try {
        
        const newEmployee = await Employee.create( req.body )

        return res.status( 201 ).json( newEmployee )

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}