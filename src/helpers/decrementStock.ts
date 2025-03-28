import { Movement } from "../models/Movement.model";
import { Product } from "../models/Product.model";

const conversiones: Record<string, number> = {
    'L': 1000,  // 1 litro = 1000 ml
    'ml': 1,    // ml es la unidad base
    'KG': 1000, // 1 kg = 1000 g
    'g': 1,     // g es la unidad base
    'unidad': 1 // Sin conversión (ejemplo: piezas)
}


/**
 * Convierte una cantidad de una unidad a su equivalente en la unidad base.
 * Ejemplo: convertirAUnidadBase(1, 'L') -> 1000
 */
const convertirAUnidadBase = ( cantidad: number, unidad: string ): number => {
    if (!conversiones[unidad]) throw new Error(`Unidad no soportada: ${ unidad }`);
    return cantidad * conversiones[unidad];
}

/**
 * Convierte una cantidad desde la unidad base a la unidad destino.
 * Ejemplo: convertirDesdeUnidadBase(1000, 'L') -> 1
 */
const convertirDesdeUnidadBase = ( cantidadEnBase: number, unidadDestino: string ): number => {
    if (!conversiones[unidadDestino]) throw new Error(`Unidad no soportada: ${ unidadDestino }`)
    return cantidadEnBase / conversiones[unidadDestino]
}

// Esta función la llamaremos cuando se registre el pago... de lo contrario cuando el servicio no finalice aún pues ya.
export const restarStock = async ( serviceId: string, productoId: string, cantidadUsada: number, unidadUsada: string ) => {

    const producto = await Product.findById( productoId )
    if ( !producto ) throw new Error('Producto no encontrado')

    // Convertir a unidad base
    const cantidadEnBase = convertirAUnidadBase( cantidadUsada, unidadUsada ) //-> Si le paso 200ml -> retornará 200
    let stockEnBase = convertirAUnidadBase( producto.quantity!, producto.size! ) //-> Si tiene 4L -> retornará 4000

    // Verificar stock suficiente
    if ( stockEnBase < cantidadEnBase ) { //-> Si 4000 < 200 restame la cantidad que usé, pero si no hay stock y no hay nada entonces saltame el error 
        if ( producto.stock > 1 ) {
            producto.stock -= 1; // Restar una unidad de stock
            stockEnBase += convertirAUnidadBase(producto.quantityOriginal!, producto.sizeOriginal! ); // Reponer con la nueva unidad
        } else {
            throw new Error('Stock insuficiente'); // Si ya no hay más unidades, error real
        }
    }

    // Restar stock
    stockEnBase -= cantidadEnBase; //-> De lo contrario solo resta 4000 - 200 -> 3800 
    
    // 🔥 Si el stock en base llega a 0, reducir stock en 1 unidad
    if ( stockEnBase === 0 ) {

        producto.stock -= 1

        // Si aún hay stock, restablecer con su presentación original guardada
        if ( producto.stock > 0 ) {

            producto.quantity = producto.quantityOriginal // Reiniciar cantidad
            producto.size = producto.sizeOriginal // Reiniciar tamaño

        } else {
            producto.quantity = 0 // Sin stock
            producto.size = 'N/A' // Sin unidad válida
        }
    } else {

        // Determinar nueva unidad y cantidad si aún queda stock en la misma unidad
        let nuevaCantidad
        let nuevaUnidad = producto.size

        // Evaluamos si el tamaño del producto es 'L' y el stockEnBase es menor a 1000 para poder convertirlo a ml
        if ( producto.size === 'L' && stockEnBase < 1000 ) {
            nuevaCantidad = stockEnBase
            nuevaUnidad = 'ml'

        } else {
            nuevaCantidad = convertirDesdeUnidadBase( stockEnBase, producto.size! ) //-> Por lo tanto la nueva cantidad seria el retorno de mi otra funcion
        }                                                                           // donde le pasamos el stockEnBase que seria 3800 y el producto tiene 'L'                                    
                                                                                    // Como resultado daría 3800/1000 (Valor de L en conversiones) -> 3.8
        // Actualizar producto en base de datos
        producto.quantity = nuevaCantidad   // -> Entonces aqui seria 3.8
        producto.size = nuevaUnidad        //-> Y aqui 'L'
    }

        // 🚨 Verificar si el stock es 3 o menos para deshabilitar el producto
    if ( producto.stock <= 3 ) {
        producto.status = false;
    }

    await producto.save() 
            
    const newMovement = new Movement({ 
        productId: productoId,
        movementType: 'Consumo por servicio',
        quantityUsed: cantidadUsada,
        size: unidadUsada,
        referenceId: serviceId,
        referenceModel: 'Sale',
    })

    await newMovement.save();

    return producto
}