import { model, Schema } from "mongoose";
import { MovementInterface } from "../interfaces/movement.interface";


const movementSchema = new Schema<MovementInterface>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    movementType: { type: String, required: true },
    quantityUsed: { type: Number, required: true, default: 0 },
    size: { type: String, enum: ['ml', 'L', 'N/A'], default: 'N/A' },
    stock: { type: Number, default: 0 },
    referenceId: { type: Schema.Types.ObjectId, refPath: 'referenceModel', required: true },
    referenceModel: { type: String, enum: ['Purchase', 'Sale'] },
    createdAt: { type: Date, default: () => new Date() }
})

export const Movement = model('Movement', movementSchema )