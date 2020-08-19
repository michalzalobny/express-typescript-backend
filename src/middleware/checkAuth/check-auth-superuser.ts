import type { RequestHandler } from 'express'
import { UserSchemaType } from '../../models/UserSchema'
export const checkAuthAdmin: RequestHandler = (req, res, next) => {
  if (req.user) {
    const userRoles = req.user as UserSchemaType
    if (userRoles.roles.some((role) => role.match(/(admin|superuser)/))) {
      next()
    } else {
      res.status(400).send()
    }
  } else {
    res.status(400).send()
  }
}
