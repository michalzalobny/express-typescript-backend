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

const PORT = getConfigVar('NEXT_PUBLIC_APP_PORT_BACK')

// DB CONFIG
import { db } from './config/database'

// Connecting session to mongoDB
const store = new MongoDBStore({
  uri: db.mongoURI,
  collection: 'sessions',
})

// Load server Routes
import { userRoute } from './routes/userRoute'
import { pageFormRoute } from './routes/pageFormRoute'

// Map global promise = get rid of warning
mongoose.Promise = global.Promise

// Connect to mongoose
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

// CookieParser
app.use(cookieParser())

// Session setup that Renews with every checkAuth
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

app.use(passport.initialize())
app.use(passport.session())

// Passport
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

// Use imported at the beggining Routes (important at client side)
app.use('/api/user', userRoute)
app.use('/api/pageform', pageFormRoute)

app.listen(PORT, () => console.log(`Server listening at :${PORT}`))
