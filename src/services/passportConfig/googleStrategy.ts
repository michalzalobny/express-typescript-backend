import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
dotenv.config()
import { findUserBy, createNewUser, tryLoggingIn } from '../userService'
import { getConfigVar } from '../getConfigVar'
import { UserSchemaType } from '../../models/UserSchema'
import type { Handler } from 'express'
import { PASSPORT_GOOGLE } from '../../constants/passportStrategies'

declare module 'passport' {
  interface Authenticator<
    InitializeRet = Handler,
    AuthenticateRet = any,
    AuthorizeRet = AuthenticateRet,
    AuthorizeOptions = AuthenticateOptions
  > {
    authenticate(strategy: typeof PASSPORT_GOOGLE, callback: (error: Error, user: UserSchemaType) => void): AuthenticateRet
  }
}

const strategyOptions = {
  clientID: getConfigVar('GOOGLE_CLIENT_ID'),
  clientSecret: getConfigVar('GOOGLE_CLIENT_SECRET'),
  callbackURL: `${getConfigVar('NEXT_PUBLIC_APP_PATH')}api/user/auth/google/callback`,
}

export const googleStrategy = new GoogleStrategy(strategyOptions, async (_accessToken, _refreshToken, profile, done) => {
  if (profile.emails && profile.displayName) {
    const foundUser = await findUserBy({ email: profile.emails[0].value })
    if (!foundUser) {
      const savedUser = await createNewUser({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: PASSPORT_GOOGLE,
        userRoles: ['user'],
        loginStrategy: PASSPORT_GOOGLE,
      })
      return done(undefined, savedUser)
    } else {
      const { message, user } = await tryLoggingIn({ password: PASSPORT_GOOGLE, loginStrategy: PASSPORT_GOOGLE, foundUser })
      if (user) {
        return done(message, user)
      } else {
        done(message, false)
      }
    }
  } else {
    done(undefined, false)
  }
})
