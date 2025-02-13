import { Request, Response } from "express";
import { Customer } from "../models/Customer.model";


export const getAllCustomers = async ( req: Request, res: Response ) => {

    try {
        
        const customers = await Customer.find()

        if( !customers ) return res.json([])

        return res.status( 200 ).json( customers )

    } catch ( error ) {

        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }
}

export const createCustomer = async ( req: Request, res: Response ) => {

    try {
        
        const newCustomer = await Customer.create( req.body )

        return res.status( 201 ).json( newCustomer )

    } catch ( error ) {

        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
        
    }
}

export const updateCustomer = async ( req: Request, res: Response ) => {
    
    const { customerId } = req.params

    try {

        if( !customerId.match(/^[0-9a-fA-F]{24}$/)) return res.status( 404 ).json({ message: `El ID ${ customerId } no existe` })
        
        const updateCustomer = await Customer.findByIdAndUpdate({ _id: customerId }, req.body, { new: true })

        return res.status( 200 ).json( updateCustomer )

    } catch ( error ) {
 
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

} 

export const deleteCustomer = async ( req: Request, res: Response ) => {
    
    const { customerId } = req.params

    try {

        const customers = await Customer.find()
        
        const existsId = customers.find( customer => customer.id === customerId )

        if( !existsId ) return res.status( 404 ).json({ message: `El ID ${ customerId } no existe` })

        await Customer.findByIdAndDelete({ _id: customerId })

        return res.status( 200 ).json({ message: 'Eliminado correctamente' })  

    } catch (error) {
    
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
        
    }
}