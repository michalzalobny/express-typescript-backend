import User, { UserSchemaType } from '../models/UserSchema'
import bcrypt from 'bcryptjs'
import { bcryptGenerate } from './bcrypt'
import { generateCryptoToken } from './crypto'

export const findUserBy = async (where: Partial<UserSchemaType>): Promise<UserSchemaType | null> => {
  const existingUser = await User.findOne(where)
  if (existingUser) {
    return existingUser
  } else {
    return null
  }
}

type CreateNewUserType = {
  userRoles: UserSchemaType['roles']
  loginStrategy: 'local' | 'google' | 'facebook'
  name: string
  email: string
  password: string
}

export const createNewUser = async ({ name, email, password, userRoles, loginStrategy }: CreateNewUserType) => {
  try {
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
    if (savedUser) return savedUser
    else throw new Error()
  } catch {
    throw new Error()
  }
}

type TryLoggingInReturnType = {
  message: string | undefined
  user: UserSchemaType | undefined
}

type TryLoggingInType = {
  password: string
  loginStrategy: UserSchemaType['loginStrategy']
  foundUser: UserSchemaType
}

export const tryLoggingIn = async ({ password, loginStrategy, foundUser }: TryLoggingInType): Promise<TryLoggingInReturnType> => {
  if (foundUser.loginStrategy === loginStrategy) {
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password)
    if (isPasswordMatch) {
      return { user: foundUser, message: undefined }
    } else {
      return { message: 'wrongPassword', user: undefined }
    }
  }
  return { user: undefined, message: undefined }
}
