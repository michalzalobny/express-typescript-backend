import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
dotenv.config()
import { findUserBy, createNewUser, tryLoggingIn } from '../userService'
import { getConfigVar } from '../getConfigVar'
import { UserSchemaType } from '../../models/UserSchema'
import type { Handler } from 'express'
declare module 'passport' {
  interface Authenticator<
    InitializeRet = Handler,
    AuthenticateRet = any,
    AuthorizeRet = AuthenticateRet,
    AuthorizeOptions = AuthenticateOptions
  > {
    authenticate(strategy: 'google', callback: (error: Error, user: UserSchemaType) => void): AuthenticateRet
  }
}

export const googleStrategy = new GoogleStrategy(
  {
    clientID: getConfigVar('GOOGLE_CLIENT_ID'),
    clientSecret: getConfigVar('GOOGLE_CLIENT_SECRET'),
    callbackURL: `${getConfigVar('NEXT_PUBLIC_APP_PATH')}api/user/auth/google/callback`,
  },
  async (_accessToken, _refreshToken, profile, done) => {
    if (profile.emails && profile.displayName) {
      const foundUser = await findUserBy({ email: profile.emails[0].value })
      if (!foundUser) {
        const savedUser = await createNewUser({
          // id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'google',
          userRoles: ['user'],
          loginStrategy: 'google',
        })
        return done(undefined, savedUser)
      } else {
        const { message, user } = await tryLoggingIn({ password: 'google', loginStrategy: 'google', foundUser })
        if (user) {
          return done(message, user)
        } else {
          done(message, false)
        }
      }
    } else {
      done(undefined, false)
    }
  }
)
