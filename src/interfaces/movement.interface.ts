import { Types } from "mongoose";
import { Size } from "./product.interface";

export interface MovementInterface {
    productId: Types.ObjectId,
    movementType: string,
    quantityUsed: number,   // Aqui para saber cuanta cantidad se ha consumido o cuanto stock se ha comprado.
    size: Size,         // Aqui igual... aunque podriamos usar lo que vendría a ser el serviceId o tal vez el PurchaseId
    stock?: number,
    referenceId: Types.ObjectId,   //id_compra_456, id_servicio
    referenceModel: string,
    createdAt: Date,
}