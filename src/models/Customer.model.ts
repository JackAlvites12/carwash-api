import { model, Schema, Types } from "mongoose";
import { CustomerInterface } from "../interfaces/customer.interface";

const customerSchema = new Schema<CustomerInterface>({

    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dni: { type: Number, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    totalVisits: { type: Number, default: 0 }

})

export const Customer = model('Customer', customerSchema )