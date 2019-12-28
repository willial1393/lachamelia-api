const nodemailer = require('nodemailer');

class Mailer {
    constructor() {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
    }

    sendMail() {
        console.log('Metodo enviar correo');
    }
}

module.exports = new Mailer();
