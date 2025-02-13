import { Types } from "mongoose";

export interface SaleInterface {
    customerId: Types.ObjectId,
    service: string,
    subtotal: number,
    total: number,
    createdAt: Date,
}
