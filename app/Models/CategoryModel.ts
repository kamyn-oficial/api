import { Schema, model } from 'mongoose'
import { CategorySchema } from 'App/Types'

const schema = new Schema<CategorySchema>({
  name: {
    type: String,
    required: true
  }
})

export default model<CategorySchema>('Category', schema)
