import { createTransport } from "nodemailer";


export const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'jackprogramador12@gmail.com',
        pass: process.env.NODEMAILER_KEY,
    }
})