import bcrypt from 'bcryptjs'
import passport from 'passport'
import { sendMail } from '../services/sendMail'
import { generateCryptoToken } from '../services/generateCryptoToken'
import type { RequestHandler } from 'express'

import User from '../models/UserSchema'

export const userPostResetEmailPassword: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.params
    const newPassword = req.body.resetUserEmailPasswordDataPassword
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    user.resetToken = undefined
    user.resetTokenExpiration = undefined
    await user.save()
    res.status(200).send()
  } catch {
    res.status(400).send()
  }
}

export const userPostResetPassword: RequestHandler = async (req, res, next) => {
  try {
    const token = (await generateCryptoToken({ cryptoRounds: 32 })) as string
    const user = await User.findOne({ email: req.body.resetUserPasswordDataEmail })
    if (user.loginStrategy === 'local') {
      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 1000 * 60 * 60 // 1hr
      await user.save()
      await sendMail({
        emailContent: ` <p>${req.body.emailData1}</p> <p>${req.body.emailData2}</p> <strong><a href="${process.env.NEXT_PUBLIC_APP_PATH}user/reset/password/${token}">${req.body.emailData3}</a></strong> `,
        emailTo: req.body.resetUserPasswordDataEmail,
        emailFrom: process.env.MAIL_USER,
        emailSubject: `${req.body.emailDataSubject}`,
      })
      res.status(200).send()
    } else {
      res.status(400).send()
    }
  } catch {
    res.status(400).send()
  }
}

export const userUpdateRoles: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    user.roles = req.body
    await user.save()
    res.status(200).send()
  } catch {
    res.status(400).send()
  }
}

export const userGetAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ date: 'desc' })
    const usersToSend = users.map(({ name, email, roles, _id }) => ({ name, email, roles, _id }))
    res.status(200).send(usersToSend)
  } catch (error) {
    res.status(400).send()
  }
}

export const userDeleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { deletedCount } = await User.deleteOne({ _id: req.params.id })
    if (deletedCount === 1) {
      res.status(200).send()
    } else {
      res.status(400).send()
    }
  } catch (error) {
    res.status(400).send()
  }
}

export const userAuthGoogleRedirect: RequestHandler = (req, res) => {
  res.redirect('/')
}

export const userAuthFacebookRedirect: RequestHandler = (req, res) => {
  res.redirect('/')
}

export const userAuthLocal: RequestHandler = (req, res, next) => {
  passport.authenticate('local', function (error, user, info) {
    if (!user) {
      res.status(400).send({ action: error })
    } else {
      req.logIn(user, function (error) {
        if (error) {
          res.status(400).send({ action: error })
        } else {
          res.status(200).send({ roles: req.user.roles, expiresIn: parseInt(process.env.APP_EXPIRATION_TIME) })
        }
      })
    }
  })(req, res, next)
}

export const getUserCredentials: RequestHandler = (req, res, next) => {
  if (req.user) {
    res.status(200).send({ roles: req.user.roles, expiresIn: parseInt(process.env.APP_EXPIRATION_TIME) })
  } else {
    res.status(400).send()
  }
}

export const userGetLogout: RequestHandler = (req, res, next) => {
  req.session.destroy(() => {
    req.logout()
    res.clearCookie('connect.sid')
    req.session = undefined
    res.status(200).send()
  })
}
