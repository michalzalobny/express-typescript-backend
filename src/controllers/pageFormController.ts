import { sendMail } from '../services/nodemailer'
import type { RequestHandler } from 'express'

export const postPageForm: RequestHandler = async (req, res) => {
  try {
    await sendMail({
      emailContent: `<p><strong>${req.body.PageFormDataName}</strong>, ${req.body.PageFormDataEmail} ${req.body.userInfo13}:<br/>${req.body.PageFormDataContent}</p>`,
      emailTo: process.env.MAIL_DESTINATION as string,
      emailFrom: process.env.MAIL_USER as string,
      emailSubject: `${req.body.userInfo12} ${req.body.PageFormDataEmail}`,
    })
    res.status(200).send()
  } catch {
    res.status(400).send()
  }
}
