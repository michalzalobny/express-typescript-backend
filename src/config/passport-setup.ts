// import passport from 'passport'
// import GoogleStrategy from 'passport-google-oauth20'
// import FacebookStrategy from 'passport-facebook'
// import LocalStrategy from 'passport-local'
// import bcrypt from 'bcryptjs'
// import crypto from 'crypto'
// import dotenv from 'dotenv'
// dotenv.config()
// import mongoose from 'mongoose'
// require('../models/UserSchema')
// const User = mongoose.model('UserSchema')

// passport.serializeUser((user, done) => {
//   done(null, user)
// })

// passport.deserializeUser((user, done) => {
//   User.findOne({ email: user.email }).then((foundUser) => {
//     done(null, foundUser)
//   })
// })

// // passport.use(
// //   new GoogleStrategy(
// //     {
// //       clientID: process.env.GOOGLE_CLIENT_ID,
// //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //       callbackURL: `${process.env.NEXT_PUBLIC_APP_PATH}api/user/auth/google/redirect`,
// //     },
// //     (accessToken, refreshToken, profile, done) => {
// //       User.findOne({ email: profile.emails[0].value }).then((foundUser) => {
// //         if (!foundUser) {
// //           const newUser = new User({
// //             _id: profile.id,
// //             name: profile.displayName,
// //             email: profile.emails[0].value,
// //             password: 'google',
// //             roles: ['user'],
// //             loginStrategy: 'google',
// //           })
// //           newUser.save().then((savedUser) => {
// //             done(null, savedUser)
// //           })
// //         } else if (foundUser.loginStrategy === 'google') {
// //           done(null, foundUser)
// //         } else {
// //           done('differentStrategy', false)
// //         }
// //       })
// //     }
// //   )
// // )

// // passport.use(
// //   new FacebookStrategy(
// //     {
// //       clientID: process.env.FACEBOOK_CLIENT_ID,
// //       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
// //       callbackURL: `${process.env.NEXT_PUBLIC_APP_PATH}api/user/auth/facebook/redirect`,
// //       profileFields: ['id', 'emails', 'name'],
// //     },
// //     (accessToken, refreshToken, profile, done) => {
// //       User.findOne({ email: profile.emails[0].value }).then((foundUser) => {
// //         if (!foundUser) {
// //           const newUser = new User({
// //             _id: profile.id,
// //             name: `${profile.name.givenName} ${profile.name.familyName}`,
// //             email: profile.emails[0].value,
// //             password: 'facebook',
// //             roles: ['user'],
// //             loginStrategy: 'facebook',
// //           })
// //           newUser.save().then((savedUser) => {
// //             done(null, savedUser)
// //           })
// //         } else if (foundUser.loginStrategy === 'facebook') {
// //           done(null, foundUser)
// //         } else {
// //           done('differentStrategy', false)
// //         }
// //       })
// //     }
// //   )
// // )

// passport.use(
//   new LocalStrategy({ passReqToCallback: true }, (req, email, password, done) => {
//     User.findOne({ email }).then((foundUser) => {
//       if (!foundUser) {
//         //  We are considering, wheter name was provided or not (we have to have a name on registration!)
//         if (req.body.name) {
//           const _id = crypto.randomBytes(32).toString('hex')
//           const newUser = new User({
//             _id,
//             name: req.body.name,
//             email,
//             password,
//             roles: ['user'], // admin, superuser, user
//             loginStrategy: 'local',
//           })
//           bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(newUser.password, salt, (err, hash) => {
//               if (err !== null) {
//                 done(null, false)
//               } else {
//                 newUser.password = hash
//                 newUser
//                   .save()
//                   .then((user) => {
//                     done(null, user)
//                   })
//                   .catch((err) => {
//                     done(null, false)
//                   })
//               }
//             })
//           })
//         } else {
//           // It should go to register form
//           done('shouldRegister', false)
//         }
//       } else {
//         // If user exists, whe heve to check if his account is from local registration
//         if (foundUser.loginStrategy === 'local') {
//           bcrypt.compare(password, foundUser.password, (err, isMatch) => {
//             if (err) {
//               done(null, false)
//             } else if (isMatch) {
//               done(null, foundUser)
//             } else {
//               done('shouldLogin', false)
//             }
//           })
//         } else {
//           done('differentStrategy', false)
//         }
//       }
//     })
//   })
// )
