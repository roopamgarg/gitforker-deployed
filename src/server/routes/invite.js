const sendEmail = require('../factory/sendEmail')
module.exports = (app) =>{
    app.get('/api/send_invitation/:username/:email',(req,res)=>{
        let {email,username} = req.params;
        console.log(email,username)
        const subject = `Hey, ${username} You are invited to join Gitforker`
        const message = `We are glad to tell you that one of your programming buddy invited you to join <a href="https://gitforker.herokuapp.com">GitForker Platform</a>`
        sendEmail(email,subject,message)
        res.status(200).json({
            message:"Email Successfully Send"
        })
    });


}