import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
dotenv.config()
import { findUserBy, createNewUser, tryLoggingIn } from '../userService'

export const googleStrategy = new GoogleStrategy(
  {
    clientID: <string>process.env.GOOGLE_CLIENT_ID,
    clientSecret: <string>process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.NEXT_PUBLIC_APP_PATH}api/user/auth/google/redirect`,
  },
  async (accessToken, refreshToken, profile, done) => {
    if (profile.emails && profile.displayName) {
      const foundUser = await findUserBy({ email: profile.emails[0].value })
      if (!foundUser) {
        const savedUser = await createNewUser({
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: 'google',
          userRoles: ['user'],
          loginStrategy: 'google',
        })
        return done(undefined, savedUser)
      } else {
        const { message, user } = await tryLoggingIn({ password: 'google', loginStrategy: 'google', foundUser })
        return done(message, user)
      }
    } else {
      done(undefined, false)
    }
  }
)
