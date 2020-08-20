import { Strategy as FacebookStrategy } from 'passport-facebook'
import dotenv from 'dotenv'
dotenv.config()
import { findUserBy, createNewUser, tryLoggingIn } from '../userService'
import { getConfigVar } from '../getConfigVar'

export const facebookStrategy = new FacebookStrategy(
  {
    clientID: getConfigVar('FACEBOOK_CLIENT_ID'),
    clientSecret: getConfigVar('FACEBOOK_CLIENT_SECRET'),
    callbackURL: `${getConfigVar('NEXT_PUBLIC_APP_PATH')}api/user/auth/facebook/redirect`,
    profileFields: ['id', 'emails', 'name'],
  },
  async (accessToken, refreshToken, profile, done) => {
    if (profile.emails && profile.name) {
      const foundUser = await findUserBy({ email: profile.emails[0].value })
      if (!foundUser) {
        const savedUser = await createNewUser({
          // id: profile.id,
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails[0].value,
          password: 'facebook',
          userRoles: ['user'],
          loginStrategy: 'facebook',
        })
        return done(null, savedUser)
      } else {
        const { message, user } = await tryLoggingIn({ password: 'facebook', loginStrategy: 'facebook', foundUser })
        if (user) {
          return done(message, user)
        } else {
          done(null, false)
        }
      }
    } else {
      done(null, false)
    }
  }
)
