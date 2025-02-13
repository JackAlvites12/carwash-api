import { Types } from "mongoose"

export interface PurchaseInterface {
    
    productsPurchased: ProductsPurchased[]
    subtotal: number,
    total: number,
    user?: string,
    createdAt: Date
  
}

interface ProductsPurchased {
    productId: Types.ObjectId
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number   // quantity * unitPrice (se puede calcular, pero se guarda por facilidad)
}