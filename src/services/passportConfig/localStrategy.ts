import { Strategy as LocalStrategy } from 'passport-local'
import dotenv from 'dotenv'
dotenv.config()
import { tryLoggingIn, findUserBy } from '../userService'
import { UserSchemaType } from '../../models/UserSchema'
import type { Handler } from 'express'
declare module 'passport' {
  interface Authenticator<
    InitializeRet = Handler,
    AuthenticateRet = any,
    AuthorizeRet = AuthenticateRet,
    AuthorizeOptions = AuthenticateOptions
  > {
    authenticate(strategy: 'local', callback: (error: Error, user: UserSchemaType) => void): AuthenticateRet
  }
}

export const localStrategy = new LocalStrategy({ passReqToCallback: true }, async (_req, email, password, done) => {
  try {
    const foundUser = await findUserBy({ email })
    if (!foundUser) {
      return done('shouldRegister', false)
    } else {
      const { message, user } = await tryLoggingIn({ password, loginStrategy: 'local', foundUser })
      if (user) {
        return done(message, user)
      } else {
        return done(message, false)
      }
    }
  } catch {
    done(undefined, false)
  }
})
