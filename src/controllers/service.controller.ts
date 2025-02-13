import { Request, Response } from "express";
import { Service } from "../models/Service.model";
import { Customer } from "../models/Customer.model";
import { PaymentBody } from "../interfaces/service.interface";
import { Catalog } from "../models/Catalog.model";
import { restarStock } from "../helpers/decrementStock";
import { Sale } from "../models/Sale.model";
import { MovementInterface } from "../interfaces/movement.interface";
import { Movement } from "../models/Movement.model";



export const getAllServices = async ( req: Request, res: Response ) => {

    try {
        
        const services = await Service.find().populate('customerId').populate('serviceDetails.catalogId').sort({ createdAt: -1 })

        if( !services ) return res.status( 400 ).json([])

        return res.status( 200 ).json( services )

    } catch ( error ) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}

export const getServiceById = async ( req: Request, res: Response ) => {

    const { serviceId } = req.params

    try {

        const service = await Service.findById( serviceId ).populate('customerId').populate('serviceDetails.catalogId')

        return res.status( 200 ).json( service )

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}

export const createService = async ( req: Request, res: Response ) => {

    // Buscar el último servicio para obtener el ticket más alto
    const lastService = await Service.findOne().sort({ ticket: -1 }).exec();

    // Generar el próximo ticket
    const nextTicket = lastService ? `CW-${(parseInt(lastService.ticket.split('-')[1]) + 1).toString().padStart(4, '0')}` : 'CW-0001'; // Si no hay servicios, empieza en CW-0001

    //
    const { customerId, customerInfo } = req.body

    try {

        const resolvedCustomerId = customerInfo ? (await Customer.create( customerInfo ))._id : customerId;

        // Crear y guardar el nuevo servicio
        const newService = new Service({
            ...req.body,
            customerId: resolvedCustomerId,
            ticket: nextTicket,
        })

        await newService.save()
  
      // Obtener el servicio con los datos relacionados
      const populatedService = await Service.findById( newService._id )
        .populate('customerId')
        .populate('serviceDetails.catalogId');

        console.log( populatedService );
        

        return res.status( 201 ).json( populatedService )

    } catch ( error ) {
           
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}

export const updateService = async ( req: Request, res: Response ) => {

    const { serviceId } = req.params

    try {
        
        const updatedService = await Service.findByIdAndUpdate( serviceId, req.body, { new: true })

        return res.status( 200 ).json( updatedService )


    } catch ( error ) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}

export const registerPaymentInService = async ( req: Request, res: Response ) => {

    const { serviceId } = req.params
    const body = req.body as PaymentBody

    try {

        // Update Service
        const service = await Service.findById( serviceId )
        if( !service ) throw Error('Servicio no encontrado')

        // Catalog
        const catalogId = service.serviceDetails.catalogId

        const catalog = await Catalog.findById( catalogId ).populate('assignedProducts.product')
        if( !catalog ) throw Error('Servicio no encontrado')
        
        // Customer
        const newCustomer = await Customer.findById( service.customerId )

        // Movements
        const movements = await Movement.find().populate('productId')

        // Restar Stock
        for ( const prod of catalog.assignedProducts as any ) {

            await restarStock( serviceId, prod.product._id, prod.quantityUsed, prod.size )

        }

        const updatedService = await Service.findByIdAndUpdate( serviceId, body, { new: true })

        const createSale = new Sale({
            customerId: service.customerId,
            service: catalog.service,
            subtotal: body.amount,
            total: body.amount,
        })

        await createSale.save()

        const newSale = await Sale.findById( createSale._id ).populate('customerId')

        
        return res.status( 200 ).json({ updatedService, newSale, movements, newCustomer })

    } catch (error) {

        console.log( error );
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
        
    }

} 