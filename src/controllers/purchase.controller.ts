import { Request, Response } from "express";
import { Purchase } from "../models/Purchase.model";
import { Movement } from "../models/Movement.model";
import { PurchaseInterface } from "../interfaces/purchase.interface";
import { Product } from "../models/Product.model";



export const getAllPurchases = async ( req: Request, res: Response ) => {

    try {
        
        const purchases = await Purchase.find().populate('productsPurchased.productId').sort({ createdAt: -1 })

        return res.status( 200 ).json( purchases )

    } catch (error) {

        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
        
    }

} 

export const createPurchase = async ( req: Request, res: Response ) => {

    const { productsPurchased } = req.body as PurchaseInterface

    try {

        const newPurchase = await Purchase.create( req.body )
        
        for ( const product of productsPurchased ) {
            
            // Aqui crearemos cada movimiento para el producto en cuestión
            const newMovement = new Movement({ 
                productId: product.productId,
                movementType: 'Entrada por compra',
                stock: product.quantity, 
                referenceId: newPurchase._id,
                referenceModel: 'Purchase',
            })

            await newMovement.save()

            // Buscamos el producto para luego actualizar su stock 
            const currentProduct = await Product.findById( product.productId )

            if( !currentProduct ) return

            currentProduct.stock += product.quantity

            if( currentProduct.stock > 3 ){
                currentProduct.status = true
            }
            
            await currentProduct.save()

        }

        return res.status( 201 ).json( newPurchase )

    } catch (error) {
        
        console.log( error );
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
    }

}