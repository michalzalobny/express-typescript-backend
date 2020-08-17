const sendEmail = require('../services/sendEmail')

exports.postPageForm = async (req, res, next) => {
  try{
    await sendEmail.sendMail({emailContent:`<p><strong>${req.body.PageFormDataName}</strong>, ${req.body.PageFormDataEmail} ${req.body.userInfo13}:<br/>${req.body.PageFormDataContent}</p>`,emailTo:process.env.MAIL_DESTINATION, emailFrom:process.env.MAIL_USER,emailSubject:`${req.body.userInfo12} ${req.body.PageFormDataEmail}`})
  res.status(200).send();
  }catch{
    res.status(400).send();
  }
}
