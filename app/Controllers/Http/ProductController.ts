import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import ProductRepository from 'App/Repositories/ProductRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { UpdateProductParams } from 'App/Types'
import CommentRepository from 'App/Repositories/CommentRepository'

export default class ProductController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const params = request.only([
        'page',
        'per_page',
        'name',
        'categories',
        'colors',
        'sizes',
        'price'
      ])
      const page = Number(params.page || 1)
      const perPage = Number(params.per_page || 15)
      const filter = {
        name: params.name,
        categories: params.categories,
        colors: params.colors,
        sizes: params.sizes,
        price: params.price
      }
      Object.entries(filter).forEach(([key, value]) => {
        if (!value) delete filter[key as keyof typeof filter]
      })
      const pagination = await ProductRepository.getAll(page, perPage, filter)
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

  public async fy({ response }: HttpContextContract) {
    try {
      const products = await ProductRepository.random(10)

      return response.json(products)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async store({ request, response }: HttpContextContract) {
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

      await CommentRepository.deleteByProductId(id)
      await ProductRepository.deleteById(id)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
