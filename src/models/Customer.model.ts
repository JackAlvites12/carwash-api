import { model, Schema } from "mongoose";
import { CustomerInterface } from "../interfaces/customer.interface";

const customerSchema = new Schema<CustomerInterface>({

    dni: { type: Number, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },

})

export const Customer = model('Customer', customerSchema )