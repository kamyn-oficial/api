import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import JoiValidateService from 'App/Services/JoiValidateService'
import MailService from 'App/Services/MailService'
import JwtService from 'App/Services/JwtService'
import JoiSchemas from 'App/JoiSchemas'
import UserRepository from 'App/Repositories/UserRepository'
import Hash from '@ioc:Adonis/Core/Hash'

export default class PasswordController extends BaseController {
  public async add({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)
      const { password } = request.only(['password'])

      const errors = JoiValidateService.validate(JoiSchemas.password, password)
      if (errors.length) return this.responseRequestError(response, errors)

      const userDB = await UserRepository.findByAccessToken(accessToken)
      if (!userDB) return response.safeStatus(404)
      if (userDB.passwordHash) return response.safeStatus(409)

      const passwordHash = await Hash.make(password)

      await UserRepository.changePasswordHashByAccessToken(
        accessToken,
        passwordHash
      )

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async change({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)
      const { oldPassword, password } = request.only([
        'oldPassword',
        'password'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.password, password)
      if (errors.length) return this.responseRequestError(response, errors)

      const userDB = await UserRepository.findByAccessToken(accessToken)
      if (!userDB) return response.safeStatus(404)
      if (!userDB.passwordHash) return this.responseCreatePassword(response)

      const isValidPassword = await Hash.verify(
        userDB.passwordHash,
        oldPassword
      )
      if (!isValidPassword)
        return response.status(401).json({
          errors: [{ field: 'oldPassword', message: 'Senha incorreta' }]
        })

      const passwordHash = await Hash.make(password)

      await UserRepository.changePasswordHashByAccessToken(
        accessToken,
        passwordHash
      )

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async forgot({ request, response }: HttpContextContract) {
    try {
      const { email } = request.only(['email'])

      const userDB = await UserRepository.findByEmail(email)
      if (!userDB) return this.responseEmailNotFound(response)

      const isExpired = userDB.resetPasswordToken
        ? await JwtService.tokenIsExpired(userDB.resetPasswordToken)
        : true

      if (!userDB.resetPasswordToken || isExpired) {
        const newResetPasswordToken = await JwtService.resetPasswordToken

        userDB.resetPasswordToken = newResetPasswordToken

        await UserRepository.changeResetPasswordTokenByEmail(
          email,
          newResetPasswordToken
        )
      }

      await MailService.sendEmailForgotPassword(email, {
        name: userDB.name,
        redirectLink: `${this.APP_FRONT_URL}/cadastro/senha-redefinir?resetPasswordToken=${userDB.resetPasswordToken}`
      })

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async reset({ request, response }: HttpContextContract) {
    try {
      const resetPasswordToken = this.getBearerToken(request)
      const { password } = request.only(['password'])

      const errors = JoiValidateService.validate(JoiSchemas.password, password)
      if (errors.length) return this.responseRequestError(response, errors)

      const userDB = await UserRepository.findByResetPasswordToken(
        resetPasswordToken
      )
      if (!userDB) return response.safeStatus(404)

      const passwordHash = await Hash.make(password)

      await UserRepository.resetPassword(resetPasswordToken, passwordHash)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
