import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RegisterParams, UserSchema } from 'App/Types'

import BaseController from './BaseController'
import JoiValidateService from 'App/Services/JoiValidateService'
import JwtService from 'App/Services/JwtService'
import MailService from 'App/Services/MailService'
import JoiSchemas from 'App/JoiSchemas'
import UserRepository from 'App/Repositories/UserRepository'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController extends BaseController {
  public async register({ request, response, ally }: HttpContextContract) {
    try {
      const validProviders = ['google', 'facebook']
      const provider: string = decodeURI(request.params().provider)
        .trim()
        .toLowerCase()

      if (validProviders.includes(provider)) {
        const driver = ally.use(provider)

        return driver.redirect()
      }

      if (request.method() !== 'POST') return response.safeStatus(405)

      const data: RegisterParams = request.only([
        'name',
        'email',
        'password',
        'phone',
        'state',
        'city',
        'address',
        'avatarUrl'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.register, data)
      if (errors.length) return this.responseRequestError(response, errors)

      const existEmail = await UserRepository.existByEmail(data.email)
      if (existEmail) return this.responseEmailExist(response)

      const [
        passwordHash,
        [accessToken, accessTokenExp],
        [confirmationToken, confirmationTokenExp]
      ] = await Promise.all([
        Hash.make(data.password),
        JwtService.accessToken,
        JwtService.confirmEmailToken
      ])

      await UserRepository.create({
        ...data,
        passwordHash,
        accessToken,
        accessTokenExp,
        confirmationToken,
        confirmationTokenExp,
        emailVerified: false
      })

      const user = {
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
        accessToken,
        accessTokenExp
      }

      return response.status(201).json({ user })
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async socialMediaCallback({
    request,
    response,
    ally
  }: HttpContextContract) {
    try {
      const { provider } = request.params()
      const driver = ally.use(provider)

      if (
        driver.accessDenied() ||
        driver.stateMisMatch() ||
        driver.hasError()
      ) {
        return response.redirect(this.APP_FRONT_URL)
      }

      const { name, email, avatarUrl, emailVerificationState } =
        await driver.user()
      const userDB = await UserRepository.findByEmail(email)

      const firstLogin = userDB !== null

      if (!userDB) {
        const [
          [accessToken, accessTokenExp],
          [confirmationToken, confirmationTokenExp]
        ] = await Promise.all([
          JwtService.accessToken,
          JwtService.confirmEmailToken
        ])
        const emailVerified = emailVerificationState === 'verified'

        const user: UserSchema = {
          name,
          email,
          emailVerified,
          avatarUrl,
          accessToken,
          accessTokenExp,
          confirmationToken,
          confirmationTokenExp
        }

        await UserRepository.create(user)

        return response.redirect(
          `${this.APP_FRONT_URL}/cadastro/pessoa-negocio-vegano-vegetariano-organico?accessToken=${user.accessToken}&firstLogin=${firstLogin}`
        )
      }

      const tokenExpiration = await JwtService.tokenExpiration(
        userDB.accessToken || ''
      )
      const tokenIsExpired = JwtService.tokenIsExpired(tokenExpiration)

      if (tokenIsExpired) {
        const [newAccessToken, newAccessTokenExp] = await JwtService.accessToken

        await UserRepository.changeAccessTokenByEmail(
          email,
          newAccessToken,
          newAccessTokenExp
        )

        userDB.accessToken = newAccessToken
        userDB.accessTokenExp = newAccessTokenExp
      }

      const user = {
        name: userDB.name,
        email,
        avatarUrl: userDB.avatarUrl,
        accessToken: userDB.accessToken,
        accessTokenExp: userDB.accessTokenExp,
        isCompany: !!userDB.companyId,
        firstLogin
      }

      return response.redirect(
        `${this.APP_FRONT_URL}/?accessToken=${user.accessToken}`
      )
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async login({ request, response }: HttpContextContract) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const userDB = await UserRepository.findByEmail(email)

      if (!userDB) return this.responseIncorrectEmailOrPassword(response)
      if (!userDB.passwordHash) return this.responseCreatePassword(response)

      const isValidPassword = await Hash.verify(userDB.passwordHash, password)
      if (!isValidPassword)
        return this.responseIncorrectEmailOrPassword(response)

      const tokenExpiration = await JwtService.tokenExpiration(
        userDB.accessToken || ''
      )
      const tokenIsExpired = JwtService.tokenIsExpired(tokenExpiration)

      if (tokenIsExpired) {
        const [newAccessToken, newAccessTokenExp] = await JwtService.accessToken

        await UserRepository.changeAccessTokenByEmail(
          userDB.email,
          newAccessToken,
          newAccessTokenExp
        )

        userDB.accessToken = newAccessToken
        userDB.accessTokenExp = newAccessTokenExp
      }

      const user = {
        name: userDB.name,
        email: userDB.email,
        avatarUrl: userDB.avatarUrl,
        accessToken: userDB.accessToken,
        accessTokenExp: userDB.accessTokenExp,
        isCompany: !!userDB.companyId
      }

      return response.json({ user })
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async singOut({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)

      await UserRepository.singOut(accessToken)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async confirmEmail({ request, response }: HttpContextContract) {
    try {
      const confirmationToken = decodeURI(request.qs().confirmationToken)

      const tokenExpiration = await JwtService.tokenExpiration(
        confirmationToken || ''
      )
      const tokenIsExpired = JwtService.tokenIsExpired(tokenExpiration)

      if (tokenIsExpired)
        return response.redirect(`${this.APP_FRONT_URL}?confirm-email=fail`)

      await UserRepository.confirmEmail(confirmationToken)

      return response.redirect(`${this.APP_FRONT_URL}?confirm-email=success`)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async sendConfirmEmail({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)

      const userDB = await UserRepository.findByAccessToken(accessToken)
      if (!userDB) return response.safeStatus(404)

      const tokenExpiration = await JwtService.tokenExpiration(
        accessToken || ''
      )
      const tokenIsExpired = JwtService.tokenIsExpired(tokenExpiration)

      if (tokenIsExpired) {
        const [confirmationToken, confirmationTokenExp] =
          await JwtService.confirmEmailToken

        await UserRepository.updateByAccessToken(accessToken, {
          confirmationToken,
          confirmationTokenExp
        })

        userDB.confirmationToken = confirmationToken
        userDB.confirmationTokenExp = confirmationTokenExp
      }

      await MailService.sendEmailConfirmation(userDB.email, {
        name: userDB.name,
        redirectLink: `${this.APP_API_URL}/confirm-email?confirmationToken=${userDB.confirmationToken}`
      })

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
