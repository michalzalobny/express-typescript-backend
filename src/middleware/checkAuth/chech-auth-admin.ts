import { RolesTypes } from '../../sharedTypes'
import type { Response, NextFunction } from 'express'

import { IUserSchema } from 'src/models/UserSchema'

interface RequestWithUser extends Request {
  user?: IUserSchema
}

export const checkAuthAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userRoles = req.user.roles

  if (userRoles.some((role) => role.match(/(admin)/))) {
    next()
  } else {
    res.status(400).send()
  }
}
