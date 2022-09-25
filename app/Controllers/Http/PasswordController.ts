import Hash from '@ioc:Adonis/Core/Hash'

import BaseController from './BaseController'
import JoiValidateService from 'App/Services/JoiValidateService'
import MailService from 'App/Services/MailService'
import JwtService from 'App/Services/JwtService'
import JoiSchemas from 'App/JoiSchemas'
import UserRepository from 'App/Repositories/UserRepository'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordController extends BaseController {
  public async change({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)

      const { password, newPassword } = request.only([
        'password',
        'newPassword'
      ])

      const errors = JoiValidateService.validate(
        JoiSchemas.password,
        newPassword
      )
      if (errors.length) return this.responseRequestError(response, errors)

      const userDB = await UserRepository.findByAccessToken(accessToken)
      if (!userDB) return response.safeStatus(404)

      const isValidPassword = await Hash.verify(userDB.passwordHash, password)
      if (!isValidPassword)
        return response.status(401).json({
          errors: [{ field: 'password', message: 'Senha incorreta' }]
        })

      const newPasswordHash = await Hash.make(newPassword)

      await UserRepository.updateById(userDB._id, {
        passwordHash: newPasswordHash
      })

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
