import mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    new Mailgenerator= new mailgen({
        theme : 'default',
        product : {
            name : 'Project Manager',
            link : 'https://projectmanager.com',
        }
    })

    const emailTextual = mailgenerator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailgenerator.generate(options.mailgenContent);
    
    const transporter = nodemailer.createTransport({
        host : process.env.MAILTRAP_SMTP_HOST,
        port : process.env.MAILTRAP_SMTP_PORT,
        auth : {
            user : process.env.MAILTRAP_SMTP_USER,
            pass : process.env.MAILTRAP_SMTP_PASS,
        }
    })

    const mail = {
        from : 'mail.projectmanager@example.com',
        to : options.email,
        subject : options.subject,
        text : emailTextual,
        html : emailHTML,
    }

    try {
        await transporter.sendMail(mail);
        console.log('Email sent successfully'); 
    }
    catch(error){
        console.error('Error sending email:', error);   
    }
}


const emailVerificationTemplate = (username, verificationUrl) => {
    return {
        body : {
            name : username,
            intro : 'Welcome to Project Manager! We\'re very excited to have you on board.',
            action : {
                instructions : 'To get started with your account, please click here:',
                button : {
                    color : '#22BC66', // Optional action button color
                    text : 'Verify Email',
                    link : verificationUrl,
                }
            },
            outro : 'Need help, or have questions? Just reply to this email, we\'d love to help.',
        }
    }
};

const ForgotPasswordTemplate = (username, resetUrl) => {
    return {
        body : {
            name : username,
            intro : 'You have requested to reset your password.',
            action : {
                instructions : 'To reset your password, please click here:',
                button : {
                    color : '#22BC66', // Optional action button color
                    text : 'Reset Password',
                    link : resetUrl,
                }
            },
            outro : 'Need help, or have questions? Just reply to this email, we\'d love to help.',
        }
    }
};

export { emailVerificationTemplate, ForgotPasswordTemplate, sendEmail };