import { Strategy as LocalStrategy } from 'passport-local'
import dotenv from 'dotenv'
dotenv.config()
import { tryLoggingIn, findUserBy } from '../userService'
import { UserSchemaType } from '../../models/UserSchema'
import { USER_SHOULD_REGISTER } from '../../constants/userMessages'
import type { Handler } from 'express'
import { PASSPORT_LOCAL } from '../../constants/passportStrategies'
declare module 'passport' {
  interface Authenticator<
    InitializeRet = Handler,
    AuthenticateRet = any,
    AuthorizeRet = AuthenticateRet,
    AuthorizeOptions = AuthenticateOptions
  > {
    authenticate(strategy: typeof PASSPORT_LOCAL, callback: (error: Error, user: UserSchemaType) => void): AuthenticateRet
  }
}

export const localStrategy = new LocalStrategy({ passReqToCallback: true }, async (_req, email, password, done) => {
  try {
    const foundUser = await findUserBy({ email })
    if (!foundUser) {
      return done(USER_SHOULD_REGISTER, false)
    } else {
      const { message, user } = await tryLoggingIn({ password, loginStrategy: PASSPORT_LOCAL, foundUser })
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
