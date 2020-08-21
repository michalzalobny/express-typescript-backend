import bcrypt from 'bcryptjs'
import passport from 'passport'
import { sendMail } from '../services/nodemailer'
import { generateCryptoToken } from '../services/crypto'
import type { RequestHandler } from 'express'
import { findUserBy, createNewUser } from '../services/userService'
import { getConfigVar } from '../services/getConfigVar'

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
    const token = await generateCryptoToken()
    const user = await findUserBy({ email: req.body.resetUserPasswordDataEmail })
    if (user) {
      if (user.loginStrategy === 'local') {
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 1000 * 60 * 60 // 1hr
        await user.save()
        await sendMail({
          emailContent: ` <p>${req.body.emailData1}</p> <p>${req.body.emailData2}</p> <strong><a href="${getConfigVar(
            'NEXT_PUBLIC_APP_PATH'
          )}user/reset/password/${token}">${req.body.emailData3}</a></strong> `,
          emailTo: req.body.resetUserPasswordDataEmail,
          emailFrom: getConfigVar('MAIL_USER'),
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
    await createNewUser({ name, email, password, userRoles: ['user', 'admin'], loginStrategy: 'local' })
    res.status(200).send()
  } catch {
    res.status(400).send()
  }
}

export const userGetAllUsers: RequestHandler = async (_req, res) => {
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

export const userAuthLocal: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (error, user) => {
    if (!user) return res.status(400).send({ action: error })
    req.logIn(user, (loginError) => {
      if (loginError) {
        res.status(400).send({ action: error })
      } else {
        res.status(200).send({ roles: user.roles, expiresIn: getConfigVar('APP_EXPIRATION_TIME') })
      }
    })
    return res.status(400).send({ action: error })
  })(req, res, next)
}

declare global {
  namespace Express {
    interface User extends UserSchemaType {}
  }
}

export const getUserCredentials: RequestHandler = (req, res) => {
  if (req.user) {
    res.status(200).send({ roles: req.user.roles, expiresIn: getConfigVar('APP_EXPIRATION_TIME') })
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
