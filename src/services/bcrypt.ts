import bcrypt from 'bcryptjs'

type BcryptGenerateType = {
  hashObject: string
}

export const bcryptGenerate = async function ({ hashObject }: BcryptGenerateType) {
  const SALT_ROUNDS = 10
  return await bcrypt.hash(hashObject, SALT_ROUNDS)
}
