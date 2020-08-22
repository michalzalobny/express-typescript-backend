import { Router } from 'express'
import passport from 'passport'
import { checkAuth } from '../middleware/checkAuth/checkAuth'

import {
  userGetAllUsers,
  userDeleteUser,
  userUpdateRoles,
  userPostResetPassword,
  userPostResetEmailPassword,
  userGetLogout,
  getUserCredentials,
  userAuthLocal,
  registerUser,
  userAuthGoogle,
  userAuthFacebook,
} from '../controllers/userController'

export const userRoute = Router()

userRoute.get('/getallusers', checkAuth(['admin']), userGetAllUsers)
userRoute.put('/updateroles/:id', checkAuth(['admin']), userUpdateRoles)
userRoute.delete('/deleteuser/:id', checkAuth(['admin']), userDeleteUser)
userRoute.post('/resetuserpassword', userPostResetPassword)
userRoute.post('/resetuseremailpassword/:token', userPostResetEmailPassword)
userRoute.get('/logout', userGetLogout)
userRoute.post('/register', registerUser)
userRoute.get('/auth/credentials', getUserCredentials)

// Local
userRoute.post('/auth/local', userAuthLocal)

// Google
userRoute.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
userRoute.get('/auth/google/callback', userAuthGoogle)

// Facebook
userRoute.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))
userRoute.get('/auth/facebook/callback', userAuthFacebook)
