import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import JwtService from 'App/Services/JwtService'

class AuthMiddleware {
  private responseUnauthorized(
    response: ResponseContract,
    field: string = 'jwt'
  ) {
    return response.status(401).json({
      errors: [
        {
          field,
          message: `${field} inválido ou expirado`
        }
      ]
    })
  }

  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    guards?: string[]
  ) {
    const tokenName = guards?.pop()

    try {
      const bearerToken = request.headers().authorization?.split(' ').pop()

      if (!bearerToken) return this.responseUnauthorized(response, tokenName)

      const bearerTokenExp = await JwtService.tokenExpiration(bearerToken)
      const bearerTokenHasExpired = JwtService.tokenIsExpired(bearerTokenExp)

      if (bearerTokenHasExpired)
        return this.responseUnauthorized(response, tokenName)

      await next()
    } catch (error) {
      console.error(error)

      return this.responseUnauthorized(response, tokenName)
    }
  }
}

export default AuthMiddleware
