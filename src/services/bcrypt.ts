import bcrypt from 'bcryptjs'

type BcryptGenerateType = {
  hashObject: string
  rounds: number
}

export const bcryptGenerate = async function ({ hashObject, rounds }: BcryptGenerateType) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(rounds, (err, salt) => {
      if (err) {
        reject(err)
      } else {
        bcrypt.hash(hashObject, salt, (err, hash) => {
          if (err) {
            reject(err)
          } else {
            resolve(hash)
          }
        })
      }
    })
  })
}
