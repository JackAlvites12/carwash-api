import { Request, Response } from "express";
import { Catalog } from "../models/Catalog.model";


export const getAllCatalogs = async( req: Request, res: Response ) => {

    try {
        
        const { status } = req.query;

        let filter = {}

        if ( status ) filter = { status: true } // Búsqueda insensible a mayúsculas/minúsculas


        const catalogs = await Catalog.find( filter ).populate('assignedStaff').populate('assignedProducts.product').sort({ createdAt: -1 })

        if( !catalogs ) return res.status( 400 ).json([])

        // ---------------------------
        for ( const catalog of catalogs ) {

            const existsActiveProduct = catalog.assignedProducts.every(( ap: any ) => ap.product.status === true )
        
            catalog.status = existsActiveProduct
        
            await catalog.save()
        }

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

export const updateCatalog = async( req: Request, res: Response ) => {

    try {
        
        const { catalogId } = req.params
        const body = req.body

        if( !catalogId ) return res.status( 404 ).json({ message: 'El id es inexistente' })

        const updatedCatalog = await Catalog.findByIdAndUpdate( catalogId, body, { new: true })

        return res.status( 200 ).json( updatedCatalog )

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}