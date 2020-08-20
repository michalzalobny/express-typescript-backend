import { getConfigVar } from '../services/getConfigVar'

export const db = {
  mongoURI: `mongodb://${getConfigVar('DATABASE_USER')}:${getConfigVar('DATABASE_PASSWORD')}@mongo46.mydevil.net/${getConfigVar(
    'DATABASE_USER'
  )}`,
}
