import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})


export const postUpLoadFile = async ( filePath: string ) => {

    try {

        const result = await cloudinary.uploader.upload( filePath )
        
        return result 
        
    } catch (error) {
        console.log( error );
        
    }
}

export const deleteFile = async ( publicId: string ) => {

    try {
        
        await cloudinary.uploader.destroy( publicId )

    } catch (error) {
        console.log( error );
        
    }
}