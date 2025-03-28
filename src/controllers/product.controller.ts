import { Request, Response } from "express";
import { Product } from "../models/Product.model";
import { deleteFile, postUpLoadFile } from "../helpers/cloudinary";


export const getAllProducts = async ( req: Request, res: Response ) => {

    try {

        // Capturar el query y el límite desde la URL
        const { q, _limit, ...filters } = req.query;

        // Crear un filtro basado en el query
        let filter: Record<string, any> = {}

        if ( q ) {
            filter = { name: { $regex: q, $options: "i" } } // Búsqueda insensible a mayúsculas/minúsculas
        }

        if ( filters ) {
            Object.keys( filters ).forEach( key => {
                if (filters[key] === "!N/A") {
                    filter[key] = { $ne: "N/A" }; // Excluye "N/A"
                } else {
                    filter[key] = filters[key]; // Aplica otros filtros normalmente
                }
            })
        }

        // Convertir _limit a número (si existe, de lo contrario usar 10)
        const limit = _limit ? parseInt(_limit as string) : 10;

        // Obtener los productos con filtro y límite
        // const products = await Product.find( filter ).limit( limit )
        const products = await Product.find( filter )

        if( products.length === 0 ) return res.json([])

        return res.status( 200 ).json( products )

    } catch ( error ) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
        
    }
}

export const getProductById = async ( req: Request, res: Response ) => {

    const { productId } = req.params

    try {
        
        const product = await Product.findById( productId )

        if( !product ) return res.status( 400 ).json({ message: `El producto con ID ${ productId } no existe` })

        return res.status( 200 ).json( product )

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}

export const createProduct = async ( req: Request, res: Response ) => { 

    const { path } = req.file as Express.Multer.File
    const body = req.body
        
        try {
            
            const upload = await postUpLoadFile( path )
    
            const newProduct = new Product( body )
            newProduct.img_url = upload?.secure_url as string
            newProduct.quantityOriginal = body.quantity
            newProduct.sizeOriginal = body.size

            await newProduct.save()
    
            return res.status( 201 ).json({ message: 'Producto creado correctamente', product: newProduct })
    
        } catch ( error ) {
    
            return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
    
        }

}

export const updateProduct = async ( req: Request, res: Response ) => {

    const { productId } = req.params
    const body = req.body

    try {
        
        if ( req.file ) {

            const { path } = req.file as Express.Multer.File;

            // Busca el producto por ID
            const product = await Product.findById( productId )

            if ( !product ) return res.status( 400 ).json({ message: `El producto con id: ${ productId } no existe` })

            // Obtén el publicId para eliminar la imagen anterior
            const publicId = product.img_url.split('/').pop()?.split('.')[0]

            if ( publicId ) {
                await deleteFile( publicId ) // Elimina la imagen anterior
            }

            // Sube la nueva imagen
            const upload = await postUpLoadFile( path ) 

            // Actualiza el producto con la nueva imagen
            const productUpdated = await Product.findByIdAndUpdate( productId,  { ...body, img_url: upload?.secure_url }, { new: true })

            return res.status( 200 ).json( productUpdated )
        }

        
        const productUpdated = await Product.findByIdAndUpdate( productId, { ...body }, { new: true })

        return res.status( 200 ).json( productUpdated )


    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}
