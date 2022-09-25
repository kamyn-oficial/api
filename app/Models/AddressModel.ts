import { Schema, model } from 'mongoose'
import { AddressSchema } from 'App/Types'

const schema = new Schema<AddressSchema>({
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
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
})

export default model<AddressSchema>('Address', schema)
