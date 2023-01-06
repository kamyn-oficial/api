import Hash from '@ioc:Adonis/Core/Hash'

import BaseController from './BaseController'
import JoiValidateService from 'App/Services/JoiValidateService'
import JwtService from 'App/Services/JwtService'
import MailService from 'App/Services/MailService'
import JoiSchemas from 'App/JoiSchemas'
import UserRepository from 'App/Repositories/UserRepository'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { RegisterParams, UpdateMeUserParams } from 'App/Types'

export default class AuthController extends BaseController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const data: RegisterParams = request.only([
        'name',
        'email',
        'cpf',
        'phone',
        'password'
      ])

      data.cpf = data.cpf.replace(/\D/g, '')

      const errors = JoiValidateService.validate(JoiSchemas.register, data)
      if (errors.length) return this.responseRequestError(response, errors)

      const existEmail = await UserRepository.existByEmail('', data.email)
      if (existEmail) return this.responseEmailExist(response)

      const existCPF = await UserRepository.existByCPF('', data.cpf)
      if (existCPF) return this.responseCpfExist(response)

      const passwordHash = await Hash.make(data.password)

      const userDB = await UserRepository.create({
        ...data,
        passwordHash
      })

      const accessToken = await JwtService.accessToken(userDB._id)

      await UserRepository.updateById(userDB._id, {
        accessToken
      })

      const user = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        accessToken
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

      if (!userDB?._id) return this.responseIncorrectEmailOrPassword(response)
      const isValidPassword = await Hash.verify(userDB.passwordHash, password)

      if (!isValidPassword)
        return this.responseIncorrectEmailOrPassword(response)

      const tokenIsExpired = await JwtService.tokenIsExpired(
        userDB.accessToken || ''
      )

      if (tokenIsExpired) {
        const newAccessToken = await JwtService.accessToken(userDB._id)

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

      return response.redirect('/')
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async me({ request, response }: HttpContextContract) {
    try {
      const user = await this.getUser(request)

      return response.json({
        name: user?.name,
        email: user?.email,
        cpf: user?.cpf,
        phone: user?.phone,
        accessToken: user?.accessToken
      })
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)
      const data: UpdateMeUserParams = request.only(['name', 'phone'])

      const errors = JoiValidateService.validate(JoiSchemas.updateMeUser, data)
      if (errors.length) return this.responseRequestError(response, errors)

      const userDB = await UserRepository.updateByAccessToken(accessToken, data)
      if (!userDB) return response.safeStatus(404)

      await UserRepository.updateByAccessToken(accessToken, data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async forgotPassword({ request, response }: HttpContextContract) {
    try {
      const { email } = request.only(['email'])

      const userDB = await UserRepository.findByEmail(email)
      if (!userDB?._id) return response.safeStatus(404)

      const token = await JwtService.resetPasswordToken(userDB._id)

      await UserRepository.updateById(userDB._id, {
        resetPasswordToken: token,
        accessToken: ''
      })

      await MailService.sendEmailForgotPassword(email, {
        name: userDB.name,
        redirectLink: `${process.env.APP_FRONT_URL}/account-reset.html?token=${token}`
      })

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    try {
      const { token, newPassword } = request.only(['token', 'newPassword'])

      const tokenIsExpired = await JwtService.tokenIsExpired(token)
      if (tokenIsExpired) return response.safeStatus(498)

      const userDB = await UserRepository.findByResetPasswordToken(token)
      if (!userDB?._id) return response.safeStatus(400)

      const passwordHash = await Hash.make(newPassword)

      await UserRepository.updateById(userDB._id, {
        resetPasswordToken: '',
        accessToken: '',
        passwordHash
      })

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
