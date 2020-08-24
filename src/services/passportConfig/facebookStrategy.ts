import { Strategy as FacebookStrategy } from 'passport-facebook'
import dotenv from 'dotenv'
dotenv.config()
import { findUserBy, createNewUser, tryLoggingIn } from '../userService'
import { getConfigVar } from '../getConfigVar'
import { UserSchemaType } from '../../models/UserSchema'
import type { Handler } from 'express'
import { PASSPORT_FACEBOOK } from '../../constants/passportStrategies'

declare module 'passport' {
  interface Authenticator<
    InitializeRet = Handler,
    AuthenticateRet = any,
    AuthorizeRet = AuthenticateRet,
    AuthorizeOptions = AuthenticateOptions
  > {
    authenticate(strategy: typeof PASSPORT_FACEBOOK, callback: (error: Error, user: UserSchemaType) => void): AuthenticateRet
  }
}

const strategyOptions = {
  clientID: getConfigVar('FACEBOOK_CLIENT_ID'),
  clientSecret: getConfigVar('FACEBOOK_CLIENT_SECRET'),
  callbackURL: `${getConfigVar('NEXT_PUBLIC_APP_PATH')}api/users/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name'],
}

export const facebookStrategy = new FacebookStrategy(strategyOptions, async (_accessToken, _refreshToken, profile, done) => {
  if (profile.emails && profile.name) {
    const foundUser = await findUserBy({ email: profile.emails[0].value })
    if (!foundUser) {
      const savedUser = await createNewUser({
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        password: PASSPORT_FACEBOOK,
        userRoles: ['user'],
        loginStrategy: PASSPORT_FACEBOOK,
      })
      return done(undefined, savedUser)
    } else {
      const { message, user } = await tryLoggingIn({ password: PASSPORT_FACEBOOK, loginStrategy: PASSPORT_FACEBOOK, foundUser })
      if (user) {
        return done(message, user)
      } else {
        done(undefined, false)
      }
    }
  } else {
    done(undefined, false)
  }
})
