
export interface UserInterface {
    username: string,
    email: string,
    password: string,
    rol: Rol[],
    encryptPassword: ( password: string ) => Promise<string>,
    validatePassword: ( password: string ) => Promise<string>
}

type Rol = 'cliente' | 'superAdmin' | 'recepcionista'