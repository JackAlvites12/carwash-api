import { Request, Response } from "express";
import { Employee } from "../models/Employee.model";

export const getAllEmployees = async ( req: Request, res: Response ) => {
 
    try {

        const { q, _limit, ...filters } = req.query;

        let filter: Record<string, any> = {}

        if ( q ) {
            filter = { name: { $regex: q, $options: "i" } } // Búsqueda insensible a mayúsculas/minúsculas
        }

        if ( filters ) {
            Object.keys( filters ).forEach( key => {
                filter[key] = filters[key]
            })
        }
        
        const employees = await Employee.find( filter ).sort({ createdAt: -1 })

        if( !employees ) return res.status( 400 ).json([])

        return res.status( 200 ).json( employees )

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }
    
}

export const getEmployeeById = async ( req: Request, res: Response ) => {

    const { employeeId } = req.params

    try {
        
        const employee = await Employee.findById( employeeId )

        return res.status( 200 ).json( employee )

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

export const updateEmployee = async ( req: Request, res: Response ) => {

    try {

        const { employeeId } = req.params
        const body = req.body

        if( !employeeId ) return res.status( 404 ).json({ message: `No se pudo encontrar el empleado con ID: ${ employeeId }`})


        if( Object.keys( body ).length === 0 ){

            const employee = await Employee.findById( employeeId )
            const toggleEmployeeStatus = await Employee.findByIdAndUpdate( employeeId, { status: !employee?.status }, { new: true })
            
            return res.status( 200 ).json( toggleEmployeeStatus )

        }

        const updatedEmployee = await Employee.findByIdAndUpdate( employeeId, body, { new: true } )


        return res.status( 200 ).json( updatedEmployee )
        
    } catch (error) {

        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
        
    }

}