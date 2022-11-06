import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import SizeRepository from 'App/Repositories/SizeRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { UpdateSizeParams } from 'App/Types'

export default class SizeController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const params = request.only(['page', 'per_page', 'all'])
      const page = Number(params.page || 1)
      const perPage = Number(params.per_page || 15)
      if (params.all) {
        const categories = await SizeRepository.findAll()
        return response.json(categories)
      }
      const pagination = await SizeRepository.getAll(page, perPage)
      return response.json(pagination)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const product = await SizeRepository.findById(id)

      return response.json(product)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const data: UpdateSizeParams = request.only(['name'])

      const errors = JoiValidateService.validate(JoiSchemas.updateSize, data)
      if (errors.length) return this.responseRequestError(response, errors)

      await SizeRepository.create(data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const data: UpdateSizeParams = request.only(['name'])

      const errors = JoiValidateService.validate(JoiSchemas.updateSize, data)
      if (errors.length) return this.responseRequestError(response, errors)

      await SizeRepository.updateById(id, data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      await SizeRepository.deleteById(id)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
