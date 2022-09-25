import mongoose from 'mongoose'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

export async function connectMongoDB() {
  const MONGODB_URI = Env.get('MONGODB_URI')

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })

    Logger.info('connected to mongodb')
  } catch (error) {
    Logger.error('error to connect mongodb', error)
  }
}
