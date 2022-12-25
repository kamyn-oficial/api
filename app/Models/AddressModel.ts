import { Schema, model } from 'mongoose'
import { AddressSchema } from 'App/Types'

const schema = new Schema<AddressSchema>(
  {
    name: {
      type: String,
      required: true
    },
    receiver: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    neighborhood: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    number: {
      type: String
    },
    complement: {
      type: String
    },
    reference: {
      type: String
    },
    zipcode: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    isDefault: {
      type: Boolean
    }
  },
  {
    timestamps: true
  }
)

export default model<AddressSchema>('Address', schema)
