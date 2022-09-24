import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RegisterParams } from 'App/Types'

import BaseController from './BaseController'
import JoiValidateService from 'App/Services/JoiValidateService'
import JwtService from 'App/Services/JwtService'
import MailService from 'App/Services/MailService'
import JoiSchemas from 'App/JoiSchemas'
import UserRepository from 'App/Repositories/UserRepository'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController extends BaseController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const data: RegisterParams = request.only([
        'name',
        'email',
        'password',
        'phone',
        'state',
        'city',
        'address'
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
        confirmationTokenExp
      })

      const user = {
        name: data.name,
        email: data.email,
        accessToken,
        accessTokenExp
      }

      return response.status(201).json(user)
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
        accessToken: userDB.accessToken,
        accessTokenExp: userDB.accessTokenExp
      }

      return response.json(user)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async logout({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)

      if (accessToken) await UserRepository.logout(accessToken)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async me({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)

      const user = await UserRepository.findByAccessToken(accessToken)

      return response.json({
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        state: user?.state,
        city: user?.city,
        address: user?.address,
        accessToken: user?.accessToken,
        emailVerifiedAt: user?.emailVerifiedAt
      })
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
