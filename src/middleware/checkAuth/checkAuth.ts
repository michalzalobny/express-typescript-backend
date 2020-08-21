import { RequestHandler } from 'express'
import { RolesTypes } from '../../../types/sharedTypes'

export const checkAuth: (roles: RolesTypes[]) => RequestHandler = (roles) => (req, res, next) => {
  if (req.user) {
    if (req.user.roles.some((userRole) => roles.includes(userRole))) {
      next()
    } else {
      // 403 - forbidden
      res.status(403).send()
    }
  } else {
    // 401 - unauthorize
    res.status(401).send()
  }
}
