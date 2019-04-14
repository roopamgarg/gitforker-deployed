const nodemailer = require('nodemailer');

sendEmail = (email,subject,message) =>{
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport 
        let transporter = nodemailer.createTransport({
        service:'gmail',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user:"roopamg777@gmail.com", // generated ethereal user
                pass: "rg@527527" // generated ethereal password
            }
        });
        
        // setup email data with unicode symbols
        let mailOptions = {
            from: "roopamg777@gmail.com", // sender address
            to:email, // list of receivers
            subject: subject, // Subject line
            // text: message, /plain text body
         html: message // html body
        };
        
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // return res.status(400).json({
                //     message:"Sorry , we are enable to send an mail to this email id"
                // })
                console.log(error)
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
        });
}

module.exports = sendEmail;