import { Router } from 'express'
import passport from 'passport'
import { checkAuth } from '../middleware/checkAuth/checkAuth'
import { PASSPORT_GOOGLE, PASSPORT_FACEBOOK } from '../constants/passportStrategies'
import {
  getAllUsers,
  deleteUser,
  updateUserRoles,
  sendPasswordResetEmail,
  resetUserPassword,
  logoutUser,
  getUserCredentials,
  userAuthLocal,
  registerUser,
  userAuthGoogle,
  userAuthFacebook,
} from '../controllers/userController'

export const usersRoute = Router()

usersRoute.get('/', checkAuth(['admin']), getAllUsers)
usersRoute.put('/:id', checkAuth(['admin']), updateUserRoles)
usersRoute.delete('/:id', checkAuth(['admin']), deleteUser)
usersRoute.post('/reset-password', sendPasswordResetEmail)
usersRoute.post('/reset-password/:token', resetUserPassword)
usersRoute.post('/logout', logoutUser)
usersRoute.post('/register', registerUser)
usersRoute.get('/auth/credentials', getUserCredentials)

// Local
usersRoute.post('/auth/local', userAuthLocal)

// Google
usersRoute.get('/auth/google', passport.authenticate(PASSPORT_GOOGLE, { scope: ['email', 'profile'] }))
usersRoute.get('/auth/google/callback', userAuthGoogle)

// Facebook
usersRoute.get('/auth/facebook', passport.authenticate(PASSPORT_FACEBOOK, { scope: ['email'] }))
usersRoute.get('/auth/facebook/callback', userAuthFacebook)
