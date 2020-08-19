import crypto from 'crypto'

type Props = {
  cryptoRounds: number
}

export const generateCryptoToken = async ({ cryptoRounds }: Props): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(cryptoRounds, (error, buffer) => {
      if (!error) {
        resolve(buffer.toString('hex'))
      } else {
        reject(error)
      }
    })
  })
}
