import Hash from '@ioc:Adonis/Core/Hash'

import BaseController from './BaseController'
import UserRepository from 'App/Repositories/UserRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { CreateUserParams, UpdateUserParams } from 'App/Types'

export default class UserController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const params = request.only(['page', 'per_page'])
      const page = Number(params.page || 1)
      const perPage = Number(params.per_page || 15)
      const pagination = await UserRepository.getAll(page, perPage)
      return response.json(pagination)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data: CreateUserParams = request.only([
        'name',
        'email',
        'cpf',
        'password',
        'phone',
        'isAdm'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.createUser, data)
      if (errors.length) return this.responseRequestError(response, errors)

      const passwordHash = await Hash.make(data.password)

      const dto = {
        ...data,
        passwordHash
      }

      await UserRepository.create(dto)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)
      const data: UpdateUserParams = request.only([
        'name',
        'email',
        'cpf',
        'password',
        'phone',
        'isAdm'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.updateUser, data)
      if (errors.length) return this.responseRequestError(response, errors)

      const passwordHash = await Hash.make(data.password)

      const dto = {
        ...data,
        passwordHash
      }

      const userDB = await UserRepository.updateById(id, dto)
      if (!userDB) return response.safeStatus(404)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const userDB = await UserRepository.deleteById(id)
      if (!userDB) return response.safeStatus(404)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
