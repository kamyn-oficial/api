import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRepository from 'App/Repositories/UserRepository'
import JwtService from 'App/Services/JwtService'

class AuthMiddleware {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    guards: string[]
  ) {
    try {
      const isAdm = guards?.pop() === 'isAdm'

      const accessToken = request.headers().authorization?.split(' ').pop()

      if (!accessToken) return response.status(403)

      const accessTokenExpired = await JwtService.tokenIsExpired(accessToken)

      if (accessTokenExpired) return response.status(403)

      const { userId } = await JwtService.payload(accessToken)

      if (isAdm) {
        if (!await UserRepository.isAdm(userId)) return response.status(403)
      }

      await next()
    } catch (error) {
      console.error(error)
      return response.status(403)
    }
  }
}

export default AuthMiddleware
