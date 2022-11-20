import { Schema, model } from 'mongoose'
import { CommentSchema } from 'App/Types'

const schema = new Schema<CommentSchema>({
  text: {
    type: String,
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

export default model<CommentSchema>('Comment', schema)
