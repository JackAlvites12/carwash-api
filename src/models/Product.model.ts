import { model, Schema } from "mongoose";
import { ProductInterface } from "../interfaces/product.interface";

const productSchema = new Schema<ProductInterface>({
    
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    size: { type: String, enum: ['ml', 'L', 'N/A'], default: '' },
    stock: { type: Number, required: true },
    img_url: { type: String, required: true },
    quantityOriginal: { type: Number, default: 0 },
    sizeOriginal: { type: String, enum: ['ml', 'L', 'N/A'], default: '' }
})

export const Product = model('Product', productSchema )