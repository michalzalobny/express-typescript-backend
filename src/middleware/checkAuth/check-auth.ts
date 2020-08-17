module.exports = (req, res, next) => {
  const userRoles = req.user.roles
  if (userRoles.some((role) => role.match(/(admin|user|superuser)/))) {
    next()
  } else {
    res.status(400).send()
  }
}
