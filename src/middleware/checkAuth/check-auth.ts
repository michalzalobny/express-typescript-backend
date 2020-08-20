import type { RequestHandler } from 'express'
export const checkAuthAdmin: RequestHandler = (req, res, next) => {
  if (req.user) {
    if (req.user.roles.some((role) => role.match(/(admin|user|superuser)/))) {
      next()
    } else {
      res.status(400).send()
    }
  } else {
    res.status(400).send()
  }
}
