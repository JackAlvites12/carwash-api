import { model, Schema } from "mongoose";
import { EmployeeInterface } from "../interfaces/employee.interface";

const employeeSchema = new Schema<EmployeeInterface>({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    rol: { type: String, enum: ['Especialista en Llantas', 'Lavador general', 'Aspirador Interior', 'Encerador y Pulidor', 'Supervisor', 'Recepcionista'], required: true },
    country: { type: String, required: true },
    phone: { type: Number, required: true },
    createdAt: { type: Date, default: () => new Date() },
})

export const Employee = model('Employee', employeeSchema )
