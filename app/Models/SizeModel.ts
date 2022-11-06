import { Schema, model } from 'mongoose'
import { SizeSchema } from 'App/Types'

const schema = new Schema<SizeSchema>({
  name: {
    type: String,
    required: true
  }
})

export default model<SizeSchema>('Size', schema)
