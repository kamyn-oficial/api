import { Schema, model } from 'mongoose'
import { BannerSchema } from 'App/Types'

const schema = new Schema<BannerSchema>(
  {
    photo: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    button: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default model<BannerSchema>('Banner', schema)
