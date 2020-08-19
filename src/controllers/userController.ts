import bcrypt from 'bcryptjs'
import passport from 'passport'
import { sendMail } from '../services/nodemailer'
import { generateCryptoToken } from '../services/crypto'
import type { RequestHandler } from 'express'
import { findUserBy, createNewUser } from '../services/userService'

import User, { UserSchemaType } from '../models/UserSchema'

export const userPostResetEmailPassword: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params
    const newPassword = req.body.resetUserEmailPasswordDataPassword
    const user = await findUserBy({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      user.resetToken = undefined
      user.resetTokenExpiration = undefined
      await user.save()
      res.status(200).send()
    } else {
      throw new Error()
    }
  } catch {
    res.status(400).send()
  }
}

export const userPostResetPassword: RequestHandler = async (req, res) => {
  try {
    const token = await generateCryptoToken({ cryptoRounds: 32 })
    const user = await findUserBy({ email: req.body.resetUserPasswordDataEmail })
    if (user) {
      if (user.loginStrategy === 'local') {
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 1000 * 60 * 60 // 1hr
        await user.save()
        await sendMail({
          emailContent: ` <p>${req.body.emailData1}</p> <p>${req.body.emailData2}</p> <strong><a href="${process.env.NEXT_PUBLIC_APP_PATH}user/reset/password/${token}">${req.body.emailData3}</a></strong> `,
          emailTo: req.body.resetUserPasswordDataEmail,
          emailFrom: <string>process.env.MAIL_USER,
          emailSubject: `${req.body.emailDataSubject}`,
        })
        res.status(200).send()
      } else {
        throw new Error()
      }
    } else {
      throw new Error()
    }
  } catch {
    res.status(400).send()
  }
}

export const userUpdateRoles: RequestHandler = async (req, res) => {
  try {
    const user = await findUserBy({ _id: req.params.id })
    if (user) {
      user.roles = req.body
      await user.save()
      res.status(200).send()
    } else {
      throw new Error()
    }
  } catch {
    res.status(400).send()
  }
}

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const id = await generateCryptoToken({ cryptoRounds: 32 })
    await createNewUser({ id, name, email, password, userRoles: ['user'], loginStrategy: 'local' })
    res.status(200).send()
  } catch {
    res.status(400).send()
  }
}

export const userGetAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find({}).sort({ date: 'desc' })
    const usersToSend = users.map(({ name, email, roles, _id }) => ({ name, email, roles, _id }))
    res.status(200).send(usersToSend)
  } catch (error) {
    res.status(400).send()
  }
}

export const userDeleteUser: RequestHandler = async (req, res) => {
  try {
    const { deletedCount } = await User.deleteOne({ _id: req.params.id })
    if (deletedCount === 1) {
      res.status(200).send()
    } else {
      throw new Error()
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
  passport.authenticate('local', (error, user) => {
    req.logIn(user, (loginError) => {
      if (loginError) {
        res.status(400).send({ action: error })
      } else {
        const requestUser = req.user as UserSchemaType
        res.status(200).send({ roles: requestUser.roles, expiresIn: process.env.APP_EXPIRATION_TIME })
      }
    })
  })(req, res, next)
}

export const getUserCredentials: RequestHandler = (req, res) => {
  const requestUser = req.user as UserSchemaType
  if (requestUser) {
    res.status(200).send({ roles: requestUser.roles, expiresIn: process.env.APP_EXPIRATION_TIME })
  } else {
    res.status(400).send()
  }
}

export const userGetLogout: RequestHandler = (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      req.logout()
      res.clearCookie('connect.sid')
      req.session = undefined
      res.status(200).send()
    })
  }
}
