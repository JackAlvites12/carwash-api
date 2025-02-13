import { Types } from "mongoose";

export interface ServiceInterface {

    ticket: string
    customerId: Types.ObjectId,
    vehicleDetails: VehicleDetails,
    serviceDetails: ServiceDetails,
    observations: string,
    status: Status,
    paymentMethod: PaymentMethod,
    amount: number,
}

interface VehicleDetails {
    vehicleType: string,
    plateLicense: string,
    color: string,
    brandAndModel: string,
}

interface ServiceDetails {
    catalogId: Types.ObjectId,
    additionalDetails: string,
}

export interface PaymentBody {
    paymentMethod: PaymentMethod,
    amount: number 
}

type PaymentMethod = 'Efectivo' | 'Transferencia bancaria' | 'Yape' | 'Plin' | 'Pendiente'
type Status = 'Pending' | 'Working' | 'Completed' | 'Finished'

