import { Strategy as LocalStrategy } from 'passport-local'
import dotenv from 'dotenv'
dotenv.config()
import { tryLoggingIn, findUserBy } from '../userService'

export const localStrategy = new LocalStrategy({ passReqToCallback: true }, async (req, email, password, done) => {
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
