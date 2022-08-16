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
  emailVerified: {
    type: Boolean,
    required: true
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
    type: String
  },
  accessToken: {
    type: String,
    required: true
  },
  accessTokenExp: {
    type: Number
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordTokenExp: {
    type: Number
  },
  confirmationToken: {
    type: String
  },
  confirmationTokenExp: {
    type: Number
  },
  avatarUrl: {
    type: String
  },
  createdAt: {
    type: Number
  }
})

export default model<UserSchema>('User', schema)
