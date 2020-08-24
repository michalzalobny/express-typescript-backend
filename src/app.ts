import express from 'express'
import session from 'express-session'
import { default as connectMongoDBSession } from 'connect-mongodb-session'
const MongoDBStore = connectMongoDBSession(session)
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import passport from 'passport'
import { localStrategy } from './services/passportConfig/localStrategy'
import { facebookStrategy } from './services/passportConfig/facebookStrategy'
import { googleStrategy } from './services/passportConfig/googleStrategy'
import User, { UserSchemaType } from './models/UserSchema'
import { getConfigVar } from './services/getConfigVar'
import { db } from './config/database'
import { usersRoute } from './routes/usersRoute'
import { pageFormRoute } from './routes/pageFormRoute'

const PORT = getConfigVar('NEXT_PUBLIC_APP_PORT_BACK')

const store = new MongoDBStore({
  uri: db.mongoURI,
  collection: 'sessions',
})

// Map global promise = get rid of warning
mongoose.Promise = global.Promise

mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(() => console.log('Cannot connect to database...'))

const app = express()

passport.use(localStrategy)
passport.use(facebookStrategy)
passport.use(googleStrategy)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Serving static images from server
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())
app.use(
  session({
    secret: getConfigVar('COOKIE_SECRET'),
    saveUninitialized: false,
    resave: true,
    rolling: true,
    store,
    cookie: {
      maxAge: Number(getConfigVar('APP_EXPIRATION_TIME')),
      sameSite: 'lax',
      // secure:true
    },
  })
)
passport.serializeUser<UserSchemaType, string>((user, done) => {
  done(undefined, user._id)
})

passport.deserializeUser<UserSchemaType, string>(async (userId, done) => {
  try {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return done(new Error('User not found'))
    }
    done(undefined, user)
  } catch (e) {
    done(e)
  }
})

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/users', usersRoute)
app.use('/api/pageform', pageFormRoute)

app.listen(PORT, () => console.log(`Server listening at :${PORT}`))
