import { model, Schema } from "mongoose";
import { SaleInterface } from "../interfaces/sale.interface";


const saleSchema = new Schema<SaleInterface>({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    service: { type: String, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: () => new Date() },
})

export const Sale = model('Sale', saleSchema )