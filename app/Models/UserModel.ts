import { Schema, model } from 'mongoose'
import { UserSchema } from 'App/Types'

const schema = new Schema<UserSchema>({
  isAdm: {
    type: Boolean
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  address: {
    type: String
  },
  passwordHash: {
    type: String,
    required: true
  },
  accessToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  confirmationToken: {
    type: String
  },
  emailVerifiedAt: {
    type: Number
  },
  createdAt: {
    type: Number
  }
})

export default model<UserSchema>('User', schema)
