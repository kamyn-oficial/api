import { Schema, model } from 'mongoose'
import { UserSchema } from 'App/Types'

const schema = new Schema<UserSchema>(
  {
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
    cpf: {
      type: String,
      required: true
    },
    phone: {
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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
)

export default model<UserSchema>('User', schema)
