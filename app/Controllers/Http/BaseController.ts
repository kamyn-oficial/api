import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { JoiError } from 'App/Types'
import Env from '@ioc:Adonis/Core/Env'

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
    const token = request.headers().authorization?.split(' ').pop() || ''

    return token
  }
}
