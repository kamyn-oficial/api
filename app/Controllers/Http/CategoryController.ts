import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import CategoryRepository from 'App/Repositories/CategoryRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { UpdateCategoryParams } from 'App/Types'

export default class CategoryController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const params = request.only(['page', 'per_page', 'all'])
      const page = Number(params.page || 1)
      const perPage = Number(params.per_page || 15)
      if (params.all) {
        const categories = await CategoryRepository.findAll()
        return response.json(categories)
      }
      const pagination = await CategoryRepository.getAll(page, perPage)
      return response.json(pagination)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const product = await CategoryRepository.findById(id)

      return response.json(product)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data: UpdateCategoryParams = request.only(['name'])

      const errors = JoiValidateService.validate(
        JoiSchemas.updateCategory,
        data
      )
      if (errors.length) return this.responseRequestError(response, errors)

      await CategoryRepository.create(data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const data: UpdateCategoryParams = request.only(['name'])

      const errors = JoiValidateService.validate(
        JoiSchemas.updateCategory,
        data
      )
      if (errors.length) return this.responseRequestError(response, errors)

      await CategoryRepository.updateById(id, data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      await CategoryRepository.deleteById(id)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
