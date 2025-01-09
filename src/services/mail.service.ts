import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()
let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.PROJECT_MAIL,
        pass: process.env.PROJECT_MAIL_PASSWORD
    }
});
class MailService {
    async sendVerifiedEmail(email: string, token: string, template: string) {
        await transporter.sendMail({
            from: process.env.PROJECT_MAIL,
            to: email,
            subject: 'Verify your email',
            html: template
        });
    }

    async sendResetPasswordEmail(email: string, token: string, template: string) {
        await transporter.sendMail({
            from: process.env.PROJECT_MAIL,
            to: email,
            subject: 'Reset your password',
            html: template
        });
    }

    async sendDiscount(email:string, discount_name:string){
        await transporter.sendMail({
            from: process.env.PROJECT_MAIL,
            to: email,
            subject: 'Welcome to Souvershop',
            html: `
                Discount code : ${discount_name}
            
            `
        })
    }
}
const mailService = new MailService();
export default mailService;