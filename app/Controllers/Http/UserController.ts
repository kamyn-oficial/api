import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import UserRepository from 'App/Repositories/UserRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { UpdateUserParams, SearchUserParams } from 'App/Types'

export default class UserController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)

      const userDB = await UserRepository.findByAccessToken(accessToken)
      if (!userDB) return response.safeStatus(404)

      const user: any = {
        name: userDB.name,
        phone: userDB.phone,
        email: userDB.email,
        state: userDB.state,
        city: userDB.city,
        address: userDB.address,
        accessToken: userDB.accessToken,
        hasPassword: !!userDB.passwordHash,
        isAdm: userDB.isAdm,
        emailVerifiedAt: userDB.emailVerifiedAt
      }

      return response.json({ user })
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async view({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)

      const userDB = await UserRepository.findByAccessToken(accessToken)
      if (!userDB) return response.safeStatus(404)
      if (!userDB.isAdm) return response.safeStatus(403)

      const userId = decodeURI(request.params().id || '')
      if (!userId) return response.safeStatus(406)

      const user = await UserRepository.findById(userId)
      if (!user) return response.safeStatus(404)

      return response.json({ user })
    } catch (error) {
      console.log('erro no view')
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

  public async delete({ request, response }: HttpContextContract) {
    try {
      const accessToken = this.getBearerToken(request)

      const userDB = await UserRepository.findByAccessToken(accessToken)
      if (!userDB) return response.safeStatus(404)
      if (!userDB.isAdm) return response.safeStatus(403)

      const userId = decodeURI(request.params().userId || '')

      const userToDelete = await UserRepository.findById(userId)
      if (!userToDelete) return response.safeStatus(406)

      await UserRepository.deleteById(userId)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
