import crypto from 'crypto'

export const generateCryptoToken = async (): Promise<string> => {
  const CRYPTO_ROUNDS = 10
  const buffer = crypto.randomBytes(CRYPTO_ROUNDS)
  return buffer.toString('hex')
}
