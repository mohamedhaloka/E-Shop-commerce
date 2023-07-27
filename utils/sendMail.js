const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'mnhaloka@gmail.com',
            pass: 'jkzkyvimlehtyckf'
        }
    });

    const mailOptions = {
        from: '"Mohamed Nasr support" <mnhaloka@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.content, // plain text body    
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendMail;