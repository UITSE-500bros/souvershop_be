const nodemailer = require('nodemailer');
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
            

        });
    }
}

export default new MailService();