import { Strategy as LocalStrategy } from 'passport-local'

import dotenv from 'dotenv'
import { generateCryptoToken } from '../../services/generateCryptoToken'
import { bcryptGenerate } from '../../services/bcrypt'
dotenv.config()
import mongoose from 'mongoose'
require('../../models/UserSchema')
const User = mongoose.model('UserSchema')

// export const localStrategy = new LocalStrategy(async (req, email, password, done) => {
//   try{
//     const user = await User.findOne({ email })
//     // Register user
//     if(!user){
//       if (req.body.name) {
//         const _id = await generateCryptoToken({cryptoRounds:32})
//         const newUser = new User({
//           _id,
//           name: req.body.name,
//           email,
//           password,
//           roles: ['user'], // admin, superuser, user
//           loginStrategy: 'local',
//         })
//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err !== null) {
//               done(null, false)
//             } else {
//               newUser.password = hash
//               newUser
//                 .save()
//                 .then((user) => {
//                   done(null, user)
//                 })
//                 .catch((err) => {
//                   done(null, false)
//                 })
//             }
//           })
//         })
//       } else {
//         // It should go to register form
//         done('shouldRegister', false)
//       }
//     }else{

//     }
//   }
// User.findOne({ email }).then((foundUser) => {
//   if (!foundUser) {
//     //  We are considering, wheter name was provided or not (we have to have a name on registration!)
//     if (req.body.name) {
//       const _id = crypto.randomBytes(32).toString('hex')
//       const newUser = new User({
//         _id,
//         name: req.body.name,
//         email,
//         password,
//         roles: ['user'], // admin, superuser, user
//         loginStrategy: 'local',
//       })
//       bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//           if (err !== null) {
//             done(null, false)
//           } else {
//             newUser.password = hash
//             newUser
//               .save()
//               .then((user) => {
//                 done(null, user)
//               })
//               .catch((err) => {
//                 done(null, false)
//               })
//           }
//         })
//       })
//     } else {
//       // It should go to register form
//       done('shouldRegister', false)
//     }
//   } else {
//     // If user exists, whe heve to check if his account is from local registration
//     if (foundUser.loginStrategy === 'local') {
//       bcrypt.compare(password, foundUser.password, (err, isMatch) => {
//         if (err) {
//           done(null, false)
//         } else if (isMatch) {
//           done(null, foundUser)
//         } else {
//           done('shouldLogin', false)
//         }
//       })
//     } else {
//       done('differentStrategy', false)
//     }
//   }
// })
// })

export const localStrategy = new LocalStrategy({ passReqToCallback: true }, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ email })
    // Register user
    if (!user) {
      if (req.body.name) {
        const _id = await generateCryptoToken({ cryptoRounds: 32 })
        const hashedPassword = await bcryptGenerate({ hashObject: password, rounds: 10 })
        // bcrypt.genSalt(10, (err, salt) => {
        //   bcrypt.hash(newUser.password, salt, (err, hash) => {
        //     if (err !== null) {
        //       done(null, false)
        //     } else {
        //       newUser.password = hash
        //       newUser
        //         .save()
        //         .then((user) => {
        //           done(null, user)
        //         })
        //         .catch((err) => {
        //           done(null, false)
        //         })
        //     }
        //   })
        // })
        const newUser = new User({
          _id,
          name: req.body.name,
          email,
          hashedPassword,
          roles: ['user'], // admin, superuser, user
          loginStrategy: 'local',
        })
        await newUser.save()
      } else {
        // It should go to register form
        done('shouldRegister', false)
      }
    } else {
    }
  } catch (error) {
    done(null, false)
  }
})
