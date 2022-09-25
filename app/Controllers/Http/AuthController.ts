import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RegisterParams, UpdateUserParams } from 'App/Types'

import BaseController from './BaseController'
import JoiValidateService from 'App/Services/JoiValidateService'
import JwtService from 'App/Services/JwtService'
import MailService from 'App/Services/MailService'
import JoiSchemas from 'App/JoiSchemas'
import UserRepository from 'App/Repositories/UserRepository'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController extends BaseController {
  public ping({ response }: HttpContextContract) {
    return response.status(200)
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const data: RegisterParams = request.only([
        'name',
        'email',
        'phone',
        'password'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.register, data)
      if (errors.length) return this.responseRequestError(response, errors)

      const existEmail = await UserRepository.existByEmail(data.email)
      if (existEmail) return this.responseEmailExist(response)

      const passwordHash = await Hash.make(data.password)

      await UserRepository.create({
        ...data,
        passwordHash
      })

      const user = {
        name: data.name,
        email: data.email,
        phone: data.phone
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

      const isValidPassword = await Hash.verify(userDB.passwordHash, password)
      if (!isValidPassword)
        return this.responseIncorrectEmailOrPassword(response)

      const tokenIsExpired = await JwtService.tokenIsExpired(
        userDB.accessToken || ''
      )

      if (tokenIsExpired) {
        const newAccessToken = await JwtService.accessToken

        await UserRepository.changeAccessTokenByEmail(
          userDB.email,
          newAccessToken
        )

        userDB.accessToken = newAccessToken
      }

      const user = {
        name: userDB.name,
        email: userDB.email,
        phone: userDB.phone,
        accessToken: userDB.accessToken
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
        accessToken: user?.accessToken,
        emailVerifiedAt: user?.emailVerifiedAt
      })
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)
      const data: UpdateUserParams = request.only(['name', 'phone'])

      const errors = JoiValidateService.validate(JoiSchemas.updateUser, data)
      if (errors.length) return this.responseRequestError(response, errors)

      const userDB = await UserRepository.updateByAccessToken(accessToken, data)
      if (!userDB) return response.safeStatus(404)

      await UserRepository.updateByAccessToken(accessToken, data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async confirmEmail({ request, response }: HttpContextContract) {
    try {
      const confirmationToken = decodeURI(request.qs().confirmationToken)

      const tokenIsExpired = await JwtService.tokenIsExpired(confirmationToken)

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

      const tokenIsExpired = await JwtService.tokenIsExpired(accessToken)

      if (tokenIsExpired) {
        const confirmationToken = await JwtService.confirmEmailToken

        await UserRepository.updateByAccessToken(accessToken, {
          confirmationToken
        })

        userDB.confirmationToken = confirmationToken
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
