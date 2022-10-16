import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import AddressRepository from 'App/Repositories/AddressRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { UpdateAddressParams } from 'App/Types'

export default class AddressController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const userId = await this.getUserId(request)

      const address = await AddressRepository.findByUserId(userId)

      return response.json(address)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const userId = await this.getUserId(request)

      const data: UpdateAddressParams = request.only([
        'name',
        'receiver',
        'neighborhood',
        'state',
        'city',
        'street',
        'number',
        'complement',
        'reference',
        'zipcode',
        'isDefault'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.updateAddress, data)
      if (errors.length) return this.responseRequestError(response, errors)

      if (data.isDefault) await AddressRepository.toggleDefaults(userId)

      const defaultAddress = (await AddressRepository.defaultAddress(userId))
        .length

      await AddressRepository.create({
        ...data,
        userId,
        isDefault: defaultAddress === 0
      })

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const data: UpdateAddressParams = request.only([
        'name',
        'receiver',
        'neighborhood',
        'state',
        'city',
        'street',
        'number',
        'complement',
        'reference',
        'zipcode',
        'isDefault'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.updateAddress, data)
      if (errors.length) return this.responseRequestError(response, errors)

      await AddressRepository.updateById(id, data)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      await AddressRepository.deleteById(id)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
