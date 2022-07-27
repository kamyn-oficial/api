import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { connectMongoDB } from 'Database/connection'
import Env from '@ioc:Adonis/Core/Env'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {
    this.app = app
  }

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    await connectMongoDB()

    const UserSeed = (await import('App/Seeds/UserSeed')).default

    const userSeed = new UserSeed({
      name: Env.get('USER_ADM_NAME'),
      email: Env.get('USER_ADM_EMAIL'),
      password: Env.get('USER_ADM_PASSWORD')
    })

    await userSeed.createAdm()
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
