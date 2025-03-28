import { Types } from "mongoose";

export interface CatalogInterface {
    service: string,
    description: string,
    assignedStaff: Types.ObjectId[]
    assignedProducts: Types.ObjectId[],
    price: number,
    status: boolean,
}