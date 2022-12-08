import Env from '@ioc:Adonis/Core/Env'

import JwtService from 'App/Services/JwtService'
import UserRepository from 'App/Repositories/UserRepository'

import type { ResponseContract } from '@ioc:Adonis/Core/Response'
import type { RequestContract } from '@ioc:Adonis/Core/Request'
import type { JoiError } from 'App/Types'

export default class BaseController {
  protected APP_FRONT_URL = Env.get('APP_FRONT_URL')
  protected APP_API_URL = Env.get('APP_API_URL')

  protected responseSomethingWrong(response: ResponseContract, error: any) {
    console.error(error)

    return response.status(500).json({
      errors: [{ message: 'Algo deu errado, tente novamente' }]
    })
  }

  protected responseRequestError(
    response: ResponseContract,
    errors: JoiError[]
  ) {
    return response.status(400).json({ errors })
  }

  protected responseNeedAuth(response: ResponseContract) {
    return response
      .status(401)
      .json({ errors: [{ message: 'Você precisa criar uma conta!' }] })
  }

  protected responseIncorrectEmailOrPassword(response: ResponseContract) {
    return response
      .status(403)
      .json({ errors: [{ message: 'Email ou senha incorretos' }] })
  }

  protected responseCreatePassword(response: ResponseContract) {
    return response.status(400).json({
      errors: [
        { message: 'Você não criou uma senha, faça login por rede social' }
      ]
    })
  }

  protected responseEmailExist(response: ResponseContract) {
    return response.status(409).json({
      errors: [
        { field: 'email', message: 'Este email já está sendo utilizado' }
      ]
    })
  }

  protected responseEmailNotFound(response: ResponseContract) {
    return response.status(404).json({
      errors: [{ field: 'email', message: 'Email não encontrado' }]
    })
  }

  protected getBearerToken(request: RequestContract) {
    const accessToken = request.headers().authorization?.split(' ').pop() || ''

    return accessToken
  }

  protected async getUserId(request: RequestContract) {
    const accessToken = request.headers().authorization?.split(' ').pop() || ''

    const { userId } = await JwtService.payload(accessToken)

    return userId
  }

  protected async getUser(request: RequestContract) {
    const userId = await this.getUserId(request)

    return UserRepository.findById(userId)
  }
}
