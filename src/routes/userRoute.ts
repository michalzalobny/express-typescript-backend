import { Router } from 'express'
import passport from 'passport'
import { checkAuthAdmin } from '../middleware/checkAuth/chech-auth-admin'

import {
  userGetAllUsers,
  userDeleteUser,
  userUpdateRoles,
  userPostResetPassword,
  userPostResetEmailPassword,
  userGetLogout,
  getUserCredentials,
  userAuthLocal,
  userAuthGoogleRedirect,
  userAuthFacebookRedirect,
  registerUser,
} from '../controllers/userController'

export const userRoute = Router()

userRoute.get('/getallusers', checkAuthAdmin, userGetAllUsers)
userRoute.put('/updateroles/:id', checkAuthAdmin, userUpdateRoles)
userRoute.delete('/deleteuser/:id', checkAuthAdmin, userDeleteUser)
userRoute.post('/resetuserpassword', userPostResetPassword)
userRoute.post('/resetuseremailpassword/:token', userPostResetEmailPassword)
userRoute.get('/logout', userGetLogout)
userRoute.post('/register', registerUser)

// Local
userRoute.post('/auth/local', userAuthLocal)

userRoute.get('/auth/credentials', getUserCredentials)

// Google
userRoute.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
userRoute.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/?auth-info=fail' }), userAuthGoogleRedirect)

// Facebook
userRoute.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))
userRoute.get(
  '/auth/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/?auth-info=fail' }),
  userAuthFacebookRedirect
)

// module.exports = router
