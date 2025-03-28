import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt'
import { UserInterface } from "../interfaces/user.interface";

const userSchema = new Schema<UserInterface>({

    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    rol: { type: [String], enum: ['cliente', 'recepcionista', 'superAdmin'], default: ['cliente'] }

})

userSchema.methods.encryptPassword = async ( password: string ) => {

    const salts = await bcrypt.genSalt( 10 )

    return bcrypt.hash( password, salts )

}

userSchema.methods.validatePassword = function( password: string ){

    return bcrypt.compare( password, this.password )

}

export const User = model('User', userSchema )