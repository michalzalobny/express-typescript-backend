import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import { getConfigVar } from './getConfigVar'

type SendMailProps = {
  emailContent: string
  emailSubject: string
  emailFrom: string
  emailTo: string
}

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: getConfigVar('MAIL_HOST'),
    // secureConnection: true,
    port: 587,
    auth: {
      //Poczta > Nazwa domeny > Szczegóły > zmiana hasła > i dajemy to co tam jest z emailem + hasło nowe
      user: getConfigVar('MAIL_USER'),
      pass: getConfigVar('MAIL_PASSWORD'),
    },
  })
)

export const sendMail = ({ emailContent, emailSubject, emailFrom, emailTo }: SendMailProps) => {
  return transporter.sendMail({
    to: emailTo,
    from: emailFrom,
    subject: emailSubject,
    html: emailContent,
  })
}
