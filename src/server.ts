import express from 'express'
import { dbConnection } from './database/dbConnection'

export const app = express()
const PORT = process.env.PORT

export const startServer = async () => {

    await dbConnection()

    app.listen( PORT, () => {

        console.log(`Servidor corriendo en el puerto: ${ PORT }`);
        
    })

}