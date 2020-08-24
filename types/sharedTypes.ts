import { PASSPORT_LOCAL, PASSPORT_FACEBOOK, PASSPORT_GOOGLE } from '../src/constants/passportStrategies'

export type RolesTypes = 'user' | 'superuser' | 'admin'
export type LoginStrategyType = typeof PASSPORT_LOCAL | typeof PASSPORT_GOOGLE | typeof PASSPORT_FACEBOOK
