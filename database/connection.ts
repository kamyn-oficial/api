import mongoose from 'mongoose'
import Env from '@ioc:Adonis/Core/Env'

export async function connectMongoDB() {
  const MONGODB_URI = Env.get('MONGODB_URI')

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      autoIndex: false,
      ignoreUndefined: true
    })

    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Error connecting to MongoDB', error)
  }
}
