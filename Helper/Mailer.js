import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    requireTLS: true,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,

    }
})

export const sendMail = async (email, subject, data)=>{
    try {
        const template = fs.readFileSync('emailTemplate.ejs', 'utf8');

        // Render the template with email data
        const htmlContent = ejs.render(template, { subject, data });
        var mailoptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject:subject,
            html: htmlContent
        }

        transporter.sendMail(mailoptions,(error,info)=>{
            if(error){
                console.log(error);
            }
            console.log('mail sent');
        })
    } catch (error) {
        console.log(error)
    }
}

