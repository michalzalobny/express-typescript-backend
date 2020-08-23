import User, { UserSchemaType } from '../models/UserSchema'
import bcrypt from 'bcryptjs'
import { bcryptGenerate } from './bcrypt'
import { generateCryptoToken } from './crypto'
import { WRONG_PASSWORD, USE_DIFFERENT_LOGIN_STRATEGY } from '../constants/userMessages'

export const deleteUserBy = async (where: Partial<UserSchemaType>): Promise<number> => {
  const { deletedCount } = await User.deleteOne(where)
  if (deletedCount !== 1) {
    throw new Error()
  } else {
    return deletedCount
  }
}

export const findUserBy = async (where: Partial<UserSchemaType>): Promise<UserSchemaType | null> => {
  const existingUser = await User.findOne(where)
  if (existingUser) {
    return existingUser
  } else {
    return null
  }
}

export const findAllUsers = async () => {
  return await User.find({}).sort({ date: 'desc' })
}

type CreateNewUserType = {
  userRoles: UserSchemaType['roles']
  loginStrategy: UserSchemaType['loginStrategy']
  name: UserSchemaType['name']
  email: UserSchemaType['email']
  password: UserSchemaType['password']
}

export const createNewUser = async ({ name, email, password, userRoles, loginStrategy }: CreateNewUserType) => {
  try {
    const foundUser = await findUserBy({ email })
    if (foundUser) {
      return { userAlreadyExists: true }
    } else {
      const id = await generateCryptoToken()
      const hashedPassword = await bcryptGenerate({ hashObject: password })
      const newUser = new User({
        _id: id,
        name,
        email,
        password: hashedPassword,
        roles: userRoles,
        loginStrategy,
      })
      const savedUser = await newUser.save()
      if (savedUser) return { userAlreadyExists: false }
      else throw new Error()
    }
  } catch {
    throw new Error()
  }
}

type TryLoggingInReturnType = {
  message: string | undefined
  user: UserSchemaType | undefined
}

type TryLoggingInType = {
  password: UserSchemaType['password']
  loginStrategy: UserSchemaType['loginStrategy']
  foundUser: UserSchemaType
}

export const tryLoggingIn = async ({ password, loginStrategy, foundUser }: TryLoggingInType): Promise<TryLoggingInReturnType> => {
  if (foundUser.loginStrategy === loginStrategy) {
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password)
    if (isPasswordMatch) {
      return { user: foundUser, message: undefined }
    } else {
      return { user: undefined, message: WRONG_PASSWORD }
    }
  } else {
    return { user: undefined, message: USE_DIFFERENT_LOGIN_STRATEGY }
  }
}

type SaveUserType = {
  user: UserSchemaType
}

export const saveUser = async ({ user }: SaveUserType) => {
  return await user.save()
}

export const generateTokenExpirationTime = () => {
  return Date.now() + 1000 * 60 * 60 // 1hr
}

export const failedLoginRedirect = (error: Error) => {
  return `/?message=${error}`
}
export const successLoginRedirect = () => {
  return '/'
}
