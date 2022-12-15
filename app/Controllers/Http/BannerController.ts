import BaseController from './BaseController'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'
import BannerRepository from 'App/Repositories/BannerRepository'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { BannerParams } from 'App/Types'

export default class BannerController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const params = request.only(['page', 'per_page'])
      const page = Number(params.page || 1)
      const perPage = Number(params.per_page || 15)
      const pagination = await BannerRepository.getAll(page, perPage)
      return response.json(pagination)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data: BannerParams = request.only([
        'photo',
        'title',
        'subtitle',
        'button',
        'link'
      ])

      const errors = JoiValidateService.validate(
        JoiSchemas.createOrUpdateBanner,
        data
      )
      if (errors.length) return this.responseRequestError(response, errors)

      await BannerRepository.create(data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }


  public async update({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const data: BannerParams = request.only([
        'photo',
        'title',
        'subtitle',
        'button',
        'link'
      ])

      const errors = JoiValidateService.validate(
        JoiSchemas.createOrUpdateBanner,
        data
      )
      if (errors.length) return this.responseRequestError(response, errors)

      await BannerRepository.updateById(id, data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      await BannerRepository.deleteById(id)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
