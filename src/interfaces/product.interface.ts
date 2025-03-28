export interface ProductInterface {
    name: string,
    description: string,
    brand: string,
    quantity?: number,
    price: number,
    size?: Size,
    stock: number
    img_url: string,
    quantityOriginal: number,
    sizeOriginal?: Size,
    status: boolean,
}

export type Size = 'ml' | 'L' | 'N/A' | 'kg' | 'g'