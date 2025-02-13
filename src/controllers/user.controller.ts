import { Request, Response } from "express";
import { User } from "../models/User.model";
import jwt from 'jsonwebtoken'


export const login = async ( req: Request, res: Response ) => {

    const { email, password } = req.body
    
    try {
        
        // Verificar si el email existe
        const existsEmail = await User.findOne({ email })
        if( !existsEmail ) return res.status( 404 ).json({ message: 'Email y/o Contraseña incorrectos'})
        
        // 
        const user = await User.findOne({ email })
        if( !user ) return res.status( 404 ).json({ message: 'El usuario no existe' })

        // Verificar si el password existe
        const isValidPassword = await user.validatePassword( password ) 
        if( !isValidPassword ) return res.status( 404 ).json({ message: 'Email y/o Contraseña incorrectos'})

        // Generamos token 
        const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET_KEY as string, { expiresIn: '24h' })

        // Guardamos en cookies
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 }) 

        // Mandamos el cuerpo del usuario que queremos devolver: 
        const respUser = {
            _id: user._id,
            username: user.username,
            email: user.email
        }

        return res.status( 200 ).json({ message: 'Autenticado correctamente!', user: respUser })


    } catch (error) {
        
        return res.status( 500 ).json( error )

    }
}

export const signUp = async ( req: Request, res: Response ) => {

    const { username, email, password } = req.body
    
    try {

        // Validar si existe
        const existsEmail = await User.findOne({ email })
        const existsUsername = await User.findOne({ username })

        if( existsEmail ) return res.status( 400 ).json({ message: 'El email ya existe, digite uno diferente.' })
        if( existsUsername ) return res.status( 400 ).json({ message: 'El username ya existe, digite uno diferente.' })

        // Registrar al usuario
        const user = new User({ username, email, password })

        // Encriptamos su contraseña 
        user.password = await user.encryptPassword( password )

        //
        await user.save()

        // Generamos token
        const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET_KEY as string, { expiresIn: '24h' })

        // Almacenamos el token en las cookies 
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })

        
        return res.status( 201 ).json({ message: 'Usuario creado correctamente' })


    } catch ( error ) {
        
        return res.status( 500 ).json( error )

    }
}

export const logout = async ( req: Request, res: Response ) => {

    try {

        res.clearCookie('token')

        return res.status( 200 ).json({ message: 'Sesión cerrada correctamente'})
        
    } catch ( error ) {

        return res.status( 500 ).json( error )
        
    }
}

