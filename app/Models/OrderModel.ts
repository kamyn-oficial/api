import { Schema, model } from 'mongoose'
import { OrderSchema } from 'App/Types'

const schema = new Schema<OrderSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },
    comment: {
      type: String
    },
    status: {
      type: String, // created, invoiced, shipped, delivered, canceled
      required: true
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        count: {
          type: Number,
          required: true
        },
        size: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    paymentMethod: {
      type: String,
      required: true
    },
    paymentUrl: {
      type: String
    },
    trackcode: {
      type: String
    },
    payAt: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

export default model<OrderSchema>('Order', schema)
