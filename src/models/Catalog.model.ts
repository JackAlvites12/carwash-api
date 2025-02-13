import { Schema, model } from "mongoose";
import { CatalogInterface } from "../interfaces/catalog.interface";


const catalogSchema = new Schema<CatalogInterface>({

    service: { type: String, required: true },
    description: { type: String, required: true },
    assignedStaff: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    assignedProducts: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantityUsed: { type: Number, required: true },
            size: { type: String, enum: ['ml', 'L'], default: '' },
        }
    ],
    price: { type: Number, required: true }

})

export const Catalog = model('Catalog', catalogSchema )