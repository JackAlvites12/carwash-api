export interface EmployeeInterface {
    name: string,
    lastname: string,
    rol: Rol,
    country: string,
    phone: number,
    createdAt: Date,

}

// Por ahora, esto lo convertiremos en un modelo
export type Rol = 'Especialista en Llantas' | 'Lavador general' | 'Aspirador Interior' | 'Encerador y Pulidor' | 'Supervisor' | 'Recepcionista'
// Tambien haremos que el rol sea un arreglo, por ahora no