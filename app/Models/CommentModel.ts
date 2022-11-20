import { Schema, model } from 'mongoose'
import { CommentSchema } from 'App/Types'

const schema = new Schema<CommentSchema>(
  {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
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
  },
  {
    timestamps: true
  }
)

export default model<CommentSchema>('Comment', schema)
