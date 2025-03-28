import { model, Schema } from "mongoose";
import { PurchaseInterface } from "../interfaces/purchase.interface";


const purchaseSchema = new Schema<PurchaseInterface>({

    providerDetails: {
        name: { type: String, required: true },
        ruc: { type: Number, required: true },
        address: { type: String, required: true },
        nroBoleta: { type: String, required: true },
        phone: { type: Number, required: true },
    },
    
    productsPurchased: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            unitPrice: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        }
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    user: { type: String, required: true, default: '' },
    createdAt: { type: Date, default: () => new Date() }

})

export const Purchase = model('Purchase', purchaseSchema )