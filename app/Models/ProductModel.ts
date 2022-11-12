import { Schema, model } from 'mongoose'
import { ProductSchema } from 'App/Types'

const schema = new Schema<ProductSchema>(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    promotion: {
      type: Number
    },
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
      }
    ],
    photos: {
      type: Array,
      required: true
    },
    colors: {
      type: Array,
      required: true
    },
    sizes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Size',
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
)

export default model<ProductSchema>('Product', schema)
