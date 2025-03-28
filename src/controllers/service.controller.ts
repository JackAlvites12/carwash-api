import { Request, Response } from "express";
import { Service } from "../models/Service.model";
import { Customer } from "../models/Customer.model";
import { PaymentBody } from "../interfaces/service.interface";
import { Catalog } from "../models/Catalog.model";
import { restarStock } from "../helpers/decrementStock";
import { Sale } from "../models/Sale.model";
import { Movement } from "../models/Movement.model";
import { transporter } from "../config/email/mailer";
import { render } from "@react-email/components";
import { EmailTemplate } from "../config/email/EmailTemplate";
import { ProductInterface } from "../interfaces/product.interface";
import { Product } from "../models/Product.model";



export const getAllServices = async ( req: Request, res: Response ) => {

    try {

        const { q } = req.query

        let filter = {}

        if( q ){
            filter = { ticket: { $regex: q, $options: "i" } } //-> Aqui dentro del filter veremos que es lo que queremos filtrar. 
        }
        
        const services = await Service.find( filter ).populate('customerId').populate({
            path: 'serviceDetails.catalogId',
            populate: {
                path: 'assignedStaff',
                model: 'Employee'
            }
        })
        .populate({
            path: 'serviceDetails.catalogId',
            populate: {
                path: 'assignedProducts.product',
                model: 'Product'
            }
        }).sort({ createdAt: -1 })

        if( !services ) return res.status( 400 ).json([])

        return res.status( 200 ).json( services )

    } catch ( error ) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}

export const getServiceById = async ( req: Request, res: Response ) => {

    const { serviceId } = req.params

    try {

        const service = await Service.findById( serviceId ).populate('customerId').populate({
            path: 'serviceDetails.catalogId',
            populate: {
                path: 'assignedStaff',
                model: 'Employee'
            }
        })
        .populate({
            path: 'serviceDetails.catalogId',
            populate: {
                path: 'assignedProducts.product',
                model: 'Product'
            }
        })

        return res.status( 200 ).json( service )

    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })

    }

}

export const createService = async ( req: Request, res: Response ) => {

    const { customerInfo } = req.body

    // Buscar el último servicio para obtener el ticket más alto
    const lastService = await Service.findOne().sort({ ticket: -1 }).exec();

    // Generar el próximo ticket
    const nextTicket = lastService ? `CW-${(parseInt(lastService.ticket.split('-')[1]) + 1).toString().padStart(4, '0')}` : 'CW-0001'; // Si no hay servicios, empieza en CW-0001

    try {

        let existsCustomer = await Customer.findOne({ dni: customerInfo.dni })

        if( existsCustomer ){
            
            existsCustomer.totalVisits += 1
            await existsCustomer.save()

        } else{

            existsCustomer = new Customer({
                ...customerInfo,
                totalVisits: 1
            })

            await existsCustomer.save()

        }

        // Crear y guardar el nuevo servicio
        const newService = new Service({
            ...req.body,
            customerId: existsCustomer._id,
            ticket: nextTicket,
        })


        await newService.save()
  
        // Obtener el servicio con los datos relacionados
        const populatedService = await Service.findById( newService._id )
            .populate('customerId')
            .populate('serviceDetails.catalogId');


        return res.status( 201 ).json( populatedService )

    } catch ( error ) {
           
        console.log( error );

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
        const customer = await Customer.findById( service.customerId )

        // Movements
        const movements = await Movement.find().populate('productId')

        // 
        const updatedProducts: ProductInterface[] = []

        // Restar Stock
        for ( const prod of catalog.assignedProducts as any ) {

            await restarStock( serviceId, prod.product._id, prod.quantityUsed, prod.size )

            // Buscamos los productos actualizados 
            const updatedProduct = await Product.findById( prod.product._id )

            if ( updatedProduct ) {
                updatedProducts.push( updatedProduct )
            }

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

        // CORREO 

        const propsToEmail = {
            customer: customer!,
            service: {
                ticket: service.ticket,
                amount: body.amount
            },
            catalog
        }


        const emailTemplate = await render( EmailTemplate( propsToEmail ))

        const sendEmail = await transporter.sendMail({
            from: 'jackprogramador12@gmail.com',
            to: customer?.email,
            subject: 'Gracias por tu preferencia, Carwash El Kraken',
            html: emailTemplate,
    
        })

        
        return res.status( 200 ).json({ updatedService, newSale, movements, customer, updatedProducts })

    } catch (error) {

        return res.status( 500 ).json({ error: 'Ocurrió un error en el servidor, inténtelo más tarde.' })
    }

} 