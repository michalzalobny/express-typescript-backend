import mongoose, { Schema, Document } from 'mongoose'
import { RolesTypes } from '../sharedTypes'

export interface IUserSchema extends Document {
  _id: string
  name: string
  email: string
  resetToken?: string
  resetTokenExpiration?: number
  password: string
  loginStrategy: string
  date: Date
  roles: RolesTypes[]
}

const UserSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  loginStrategy: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  roles: [{ type: String }],
})
export default mongoose.model<IUserSchema>('UserSchema', UserSchema)
