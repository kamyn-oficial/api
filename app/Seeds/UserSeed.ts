import UserRepository from 'App/Repositories/UserRepository'
import Hash from '@ioc:Adonis/Core/Hash'
import Logger from '@ioc:Adonis/Core/Logger'
import JwtService from 'App/Services/JwtService'
import { UserSchema } from 'App/Types'

interface Adm {
  name: string
  email: string
  password: string
}

class UserSeed {
  private adm: Adm

  constructor(adm: Adm) {
    this.adm = adm
  }

  public async createAdm() {
    try {
      const existEmail = await UserRepository.existByEmail(this.adm.email)

      if (existEmail) return Logger.info('user admin already exists')
      Logger.info('user admin created')

      const passwordHash = await Hash.make(this.adm.password)
      const [accessToken, accessTokenExp] = await JwtService.accessToken

      const user: UserSchema = {
        name: this.adm.name,
        email: this.adm.email,
        passwordHash,
        accessToken,
        accessTokenExp,
        isAdm: true
      }

      await UserRepository.create(user)
    } catch (error) {
      console.error(error)
    }
  }
}

export default UserSeed
