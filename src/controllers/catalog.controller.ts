import { Request, Response } from "express";
import { Catalog } from "../models/Catalog.model";


export const getAllCatalogs = async( req: Request, res: Response ) => {

    try {
        
        const catalogs = await Catalog.find().populate('assignedStaff').populate('assignedProducts.product')

        if( !catalogs ) return res.status( 400 ).json([])

        return res.status( 200 ).json( catalogs )

    } catch (error) {

        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}

export const getCatalogById = async( req: Request, res: Response ) => {

    const { catalogId } = req.params

    try {
        
        const catalog = await Catalog.findById( catalogId ).populate('assignedStaff').populate('assignedProducts.product')

        return res.status( 200 ).json( catalog )

    } catch (error) {

        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }
    
}


export const createCatalog = async( req: Request, res: Response ) => {

    try {
        
        const newCatalog = await Catalog.create( req.body )

        return res.status( 201 ).json( newCatalog )

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}