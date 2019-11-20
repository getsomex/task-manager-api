const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'mishal7874@gmail.com',
        subject : 'This is a text email from Node',
        text : `Welcome to the fam ${name}`
    })
};

const sendCancelEmail = (email,name) =>{
    sgMail.send({
        to : email,
        from : 'mishal7874@gmail.com',
        subject : 'Goodbye email',
        text : ` Goodbye from the fam ${name}`
    })
}




module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
};