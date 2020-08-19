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

const PORT = process.env.NEXT_PUBLIC_APP_PORT_BACK

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

// Passport
passport.serializeUser((user: UserSchemaType, done) => {
  done(undefined, user)
})

passport.deserializeUser(async (user: UserSchemaType, done) => {
  try {
    const foundUser = await User.findOne({ email: user.email })
    done(undefined, foundUser)
  } catch (error) {
    done(undefined, false)
  }
})

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
    secret: process.env.COOKIE_SECRET as string,
    saveUninitialized: false,
    resave: true,
    rolling: true,
    store,
    cookie: {
      maxAge: Number(process.env.APP_EXPIRATION_TIME),
      sameSite: 'lax',
      // secure:true
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Use imported at the beggining Routes (important at client side)
app.use('/api/user', userRoute)
app.use('/api/pageform', pageFormRoute)

app.listen(PORT, () => console.log(`Server listening at :${PORT}`))
