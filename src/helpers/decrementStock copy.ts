// Practiquemos esta mierda.... primero debemos pensar... como hago para restar stock a mis productos? si tienen Litros, mililitros
// Kilogramos, gramos, etc.... pues primero debemos tener en cuenta lo siguiente: si por ejemplo un servicio consume 200ml de algun producto
// yo tengo que convertir esa cantidad de mi producto si está en litro pasarlo a ml -> 1L = 1000ml 

import { Product } from "../models/Product.model"

const conversiones: Record<string, number> = {
    'L': 1000,
    'ml': 1,
    'KG': 1000,
    'g': 1,
    'unidad': 1
}

// Ahora debemos de hacer una funcion que convierta de 1L a 1000ml

// De 1L a 1000
const convertirAUnidadBase = ( cantidad: number, unidad: string ): number => {

    if( !conversiones[unidad] ) throw Error('Unidad no soportada')

    return cantidad * conversiones[unidad]

}

// De 1000 a 1 
const convertirDesdeUnidadBase = ( cantidad: number, unidadDestino: string ): number => {

    if( !conversiones[unidadDestino] ) throw Error('Unidad no soportada')

    return cantidad / conversiones[unidadDestino]

}

// Si le paso 200ml
export const restarStock = async ( productId: string, cantidadUsada: number, unidadUsada: string ) => {

    const product = await Product.findById( productId )

    if( !product ) throw Error('Producto inexistente')

    // Ahora lo que tenemos que hacer es restar la cantidad que recibimos con la cantidad de mi producto 

    const cantidadBase = convertirAUnidadBase( cantidadUsada, unidadUsada ) //-> aqui lo convierto a 200
    let stockBase = convertirAUnidadBase( product.quantity!, product.size! ) //-> Aqui ejm mi producto tiene 1L = 1000

    if( stockBase < cantidadBase ) return 

    // Ahora debo restar: 
    stockBase -= cantidadBase //-> 800

    // Ahora que tenemos el stockBase del producto debemos de condicionar algunas cositas: 
    if( stockBase === 0 ) { //-> si el stockbase llega a 0 debemos restar el stock
    
        product.stock -= 1

        if( product.stock > 0 ){  // Una vez restado el stock y sigue siendo mayor a 0 pues entonces debemos resetear su valor original
            product.quantity = product.quantityOriginal
            product.size = product.sizeOriginal

        } else{
            // de lo contrario si se queda sin stock pues lo que deberiamos hacer es resetearlo de fábrica
            product.quantity = 0
            product.size = 'N/A'
        }


    }else{

        // Okey pero si el stock no llega a 0 lo que debemos hacer ahora es poder controlar si el tamaño del producto es L y si tiene 
        // menos de 1000 para que asi podamos transformar de una vez.

        let nuevaCantidad
        let nuevaUnidad = product.size

        // Esto con el fin de asignar si es menor a 1000 entonces debe ser o tener ml y si es mayor pues L 
        if( product.size === 'L' && stockBase < 1000 ){

            nuevaCantidad = stockBase
            product.size = 'ml' 

        } else{
            nuevaCantidad = convertirDesdeUnidadBase( stockBase, product.size! )
        }

        product.quantity = nuevaCantidad
        product.size = nuevaUnidad

    }

    await product.save()

    return product
} 