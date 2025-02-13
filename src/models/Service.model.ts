import { model, Schema } from "mongoose";
import { ServiceInterface } from "../interfaces/service.interface";

const serviceSchema = new Schema<ServiceInterface>({

    ticket: { type: String, default: '', unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    observations: { type: String, default: '' },
    serviceDetails: { 
        catalogId: { type: Schema.Types.ObjectId, ref: 'Catalog' },
        additionalDetails: { type: String, default: '' }
    },
    vehicleDetails: {
        vehicleType: { type: String, required: true },
        plateLicense: { type: String, required: true },
        color: { type: String, required: true },
        brandAndModel: { type: String, required: true },
    },
    status: { type: String, enum: ['Pending', 'Working', 'Completed', 'Finished'], default: 'Pending' },
    amount: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['Efectivo', 'Transferencia bancaria', 'Yape', 'Plin', 'Pendiente'], default: 'Pendiente' },
    
}, { timestamps: true })

export const Service = model('Service', serviceSchema )
