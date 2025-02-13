import { Request, Response } from "express";
import { Sale } from "../models/Sale.model";

export const getAllSales = async ( req: Request, res: Response ) => {

    try {
        
        const sales = await Sale.find().populate('customerId').sort({ createdAt: -1 })

        return res.status( 200 ).json( sales )

    } catch (error) {
        
        console.log( error )
        

    }

}