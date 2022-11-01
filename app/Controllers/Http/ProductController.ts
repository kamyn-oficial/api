import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import ProductRepository from 'App/Repositories/ProductRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { UpdateProductParams } from 'App/Types'

export default class ProductController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const params = request.only(['page', 'per_page'])
      const page = Number(params.page || 1)
      const per_page = Number(params.per_page || 15)
      const pagination = await ProductRepository.getAll(page, per_page)
      return response.json(pagination)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const product = await ProductRepository.findById(id)

      return response.json(product)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const data: UpdateProductParams = request.only([
        'name',
        'price',
        'promotion',
        'description',
        'categories',
        'photos',
        'quantity',
        'colors',
        'sizes'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.updateProduct, data)
      if (errors.length) return this.responseRequestError(response, errors)

      await ProductRepository.create(data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const data: UpdateProductParams = request.only([
        'name',
        'price',
        'promotion',
        'description',
        'categories',
        'photos',
        'quantity',
        'colors',
        'sizes'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.updateProduct, data)
      if (errors.length) return this.responseRequestError(response, errors)

      await ProductRepository.updateById(id, data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      await ProductRepository.deleteById(id)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
