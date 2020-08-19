import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'

type SendMailProps = {
  emailContent: string
  emailSubject: string
  emailFrom: string
  emailTo: string
}

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: process.env.MAIL_HOST,
    // secureConnection: true,
    port: 587,
    auth: {
      user: process.env.MAIL_USER, // taken from Poczta > Nazwa domeny > Szczegóły > zmiana hasła > i dajemy to co tam jest z emailem + hasło nowe
      pass: process.env.MAIL_PASSWORD,
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
