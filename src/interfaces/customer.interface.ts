import { Types } from "mongoose"

export interface CustomerInterface{
    dni: number,
    fullname: string,
    email: string,
    phone: number,
    user?: Types.ObjectId,
    totalVisits: number
}