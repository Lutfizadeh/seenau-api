import nodemailer from 'nodemailer';
import mailerConfig from './mailerConfig.js';

const sendEmail = async({to, subject, html}) => {
    const transporter = nodemailer.createTransport(mailerConfig)

    return transporter.sendMail({
        from: "Lutfi zadeh Filoshof",
        to,
        subject,
        html,
    })
}

export default sendEmail