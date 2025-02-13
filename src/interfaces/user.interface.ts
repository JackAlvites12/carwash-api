export interface UserInterface {
    username: string,
    email: string,
    password: string,
    encryptPassword: ( password: string ) => Promise<string>,
    validatePassword: ( password: string ) => Promise<string>
}