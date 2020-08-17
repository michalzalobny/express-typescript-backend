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

// import './config/passport-setup'
import { localStrategy } from './config/passportStrategy/localStrategy'

const PORT = process.env.NEXT_PUBLIC_APP_PORT_BACK

// DB CONFIG
// const db = require('./config/database')
import { db } from './config/database'

// Connecting session to mongoDB
const store = new MongoDBStore({
  uri: db.mongoURI,
  collection: 'sessions',
})

// Load server Routes
const userRoute = require('./routes/userRoute')
const pageFormRoute = require('./routes/pageFormRoute')

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
// express code here
const app = express()

passport.use(localStrategy)

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Serving static images from server
app.use('/uploads', express.static('uploads'))

// CookieParser
app.use(cookieParser())

// Session setup that Renews with every checkAuth
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
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
