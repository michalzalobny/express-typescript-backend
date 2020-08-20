import { sendMail } from '../services/nodemailer'
import type { RequestHandler } from 'express'
import { getConfigVar } from '../services/getConfigVar'

export const postPageForm: RequestHandler = async (req, res) => {
  try {
    await sendMail({
      emailContent: `<p><strong>${req.body.PageFormDataName}</strong>, ${req.body.PageFormDataEmail} ${req.body.userInfo13}:<br/>${req.body.PageFormDataContent}</p>`,
      emailTo: getConfigVar('MAIL_DESTINATION'),
      emailFrom: getConfigVar('MAIL_USER'),
      emailSubject: `${req.body.userInfo12} ${req.body.PageFormDataEmail}`,
    })
    res.status(200).send()
  } catch {
    res.status(400).send()
  }
}
