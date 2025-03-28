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
        res.cookie('userId', user._id.toString(), { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })

        // Mandamos el cuerpo del usuario que queremos devolver: 
        const respUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            rol: user.rol

        }

        return res.status( 200 ).json({ message: 'Autenticado correctamente!', user: respUser })


    } catch (error) {
        
        return res.status( 500 ).json( error )

    }
}

export const signUp = async ( req: Request, res: Response ) => {

    const { username, email, password, rol } = req.body
    
    try {

        // Validar si existe
        const existsEmail = await User.findOne({ email })
        const existsUsername = await User.findOne({ username })

        if( existsEmail ) return res.status( 400 ).json({ message: 'El email ya existe, digite uno diferente.' })
        if( existsUsername ) return res.status( 400 ).json({ message: 'El username ya existe, digite uno diferente.' })

        // Registrar al usuario
        const user = new User({ username, email, password, rol })

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

export const checkAuthentication = async ( req: Request, res: Response ) => {

    try {
        
        const { token, userId } = req.cookies

        const user = await User.findById( userId )
        
        if( !user ) return res.status( 404 ).json({ message: 'El usuario no existe en la base de datos', user: null, status: false })

        const respUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            rol: user.rol
        }

        if( !token ) return res.status( 401 ).json({ message: 'Token inexistente', user: null, status: false })

        return res.status( 200 ).json({ message: 'Token existe', user: respUser, status: true })


    } catch (error) {
        
        return res.status( 500 ).json( error )

    }

}

export const checkIsSuperAdmin = async ( req: Request, res: Response ) => {

    try {
        
        const { token, userId } = req.cookies

        
        const user = await User.findById( userId )

        if( !user ) return res.status( 404 ).json({ message: 'El usuario no existe en la base de datos', user: null, status: false })

        if( !token ) return res.status( 401 ).json({ message: 'Token inexistente', user: null, status: false })

        const respUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            rol: user.rol
        }


        for ( const rol of user?.rol ) {
            
            if( rol === 'superAdmin' ){
                return res.status( 200 ).json({ message: 'Es super Admin', user: respUser, status: true })
            }

        }

        return res.status( 401 ).json({ message: 'No es super Admin', user: null, status: false })


    } catch (error) {

        return res.status( 500 ).json( error )

    }

}

export const loginAdmin = async ( req: Request, res: Response ) => {

    const { email, password } = req.body
    
    try {

        const user = await User.findOne({ email })

        if (!user || (!user.rol.includes('superAdmin') && !user.rol.includes('recepcionista'))) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        // Verificar si el password existe
        const isValidPassword = await user.validatePassword( password ) 
        if( !isValidPassword ) return res.status( 404 ).json({ message: 'Email y/o Contraseña incorrectos'})


        // Generamos token 
        const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET_KEY as string, { expiresIn: '24h' })

        // Guardamos en cookies
        res.cookie('userId', user._id.toString(), { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })

        // Mandamos el cuerpo del usuario que queremos devolver: 
        const respUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            rol: user.rol

        }

        return res.status( 200 ).json({ message: 'Autenticado correctamente!', user: respUser })


    } catch (error) {
        
        return res.status( 500 ).json( error )

    }
}

export const getAllAdmins = async ( req: Request, res: Response ) => {

    try {
        
        const admins = await User.find({ rol: { $ne: 'cliente' } })

        if( !admins ) return res.status( 404 ).json([])

        return res.status( 200 ).json( admins )

    } catch (error) {
        
        return res.status( 500 ).json( error )

    }

}

export const createAdmin = async( req: Request, res: Response ) => {

    const { username, email, password, rol } = req.body

    try {
        
        // Validar si existe
        const existsEmail = await User.findOne({ email })
        const existsUsername = await User.findOne({ username })

        if( existsEmail ) return res.status( 400 ).json({ message: 'El email ya existe, digite uno diferente.' })
        if( existsUsername ) return res.status( 400 ).json({ message: 'El username ya existe, digite uno diferente.' })

        // Registrar al usuario
        const user = new User({ username, email, password, rol })

        // Encriptamos su contraseña 
        user.password = await user.encryptPassword( password )

        //
        await user.save()

        const respUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            rol: user.rol

        }

        return res.status( 201 ).json({ message: 'Admin creado correctamente', user: respUser })
        

    } catch (error) {
        
        return res.status( 500 ).json( error )

    }

}

export const deleteAdmin = async ( req: Request, res: Response ) => {

    try {
        
        const { userId } = req.params

        if( !userId ) return res.status( 404 ).json({ message: 'El Admin no existe' })

        const admin = await User.findByIdAndDelete( userId )

        return res.status( 200 ).json({ message: 'Admin eliminado correctamente' })

        
    } catch (error) {

        return res.status( 500 ).json( error )
        
    }

}

export const checkEmail = async( req: Request, res: Response ) => {

    const { email } = req.body

    try {
        
        const existsEmail = await User.findOne({ email })

        if( existsEmail ) return res.status( 200 ).json({ email: existsEmail.email, message: 'El Email ya existe, digite uno diferente' })
        
        return res.json({})
        
    } catch (error) {

        return res.status( 500 ).json({ error: 'Ocurrió un error inesperado en el servidor, inténtelo más tarde.' })
        
    }
}

export const checkUsername = async( req: Request, res: Response ) => {

    const { username } = req.body

    try {

        const existsUsername = await User.findOne({ username })

        if( existsUsername ) return res.status( 200 ).json({ username: existsUsername.username, message: 'El Usuario ya existe, digite uno diferente' })
        
        return res.json({})
        
    } catch (error) {
        
        return res.status( 500 ).json({ error: 'Ocurrió un error inesperado en el servidor, inténtelo más tarde.' })

    }
}