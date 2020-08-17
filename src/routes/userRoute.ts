import express from 'express'
const router = express.Router() // instead of app.get, we use router.get
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
} from '../controllers/userController'

router.get('/getallusers', checkAuthAdmin, userGetAllUsers)
router.put('/updateroles/:id', checkAuthAdmin, userUpdateRoles)
router.delete('/deleteuser/:id', checkAuthAdmin, userDeleteUser)
router.post('/resetuserpassword', userPostResetPassword)
router.post('/resetuseremailpassword/:token', userPostResetEmailPassword)
router.get('/logout', userGetLogout)

// Local
router.post('/auth/local', userAuthLocal)

router.get('/auth/credentials', getUserCredentials)

// Google
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/?auth-info=fail' }), userAuthGoogleRedirect)

// Facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get('/auth/facebook/redirect', passport.authenticate('facebook', { failureRedirect: '/?auth-info=fail' }), userAuthFacebookRedirect)

module.exports = router
