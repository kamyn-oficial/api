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

  public async store({ request, response }: HttpContextContract) {
    try {
      const userId = await this.getUserId(request)

      const data: UpdateAddressParams = request.only([
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

      const defaultAddress = await AddressRepository.defaultAddress(userId)

      if (data.isDefault)
        await Promise.all(
          defaultAddress.map(({ _id }) =>
            AddressRepository.updateById(_id, { isDefault: false })
          )
        )

      const isDefault = !defaultAddress.length || data.isDefault

      await AddressRepository.create({
        ...data,
        userId,
        isDefault
      })

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)
      const user = await this.getUser(request)
      if (!user) return response.status(404)

      const data: UpdateAddressParams = request.only([
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

      const address = await AddressRepository.findById(id)
      if (!address) return response.status(404)
      if (address.userId !== user.id && !user.isAdm) return response.status(401)

      const defaultAddress = await AddressRepository.defaultAddress(user.id)

      if (data.isDefault)
        await Promise.all(
          defaultAddress.map(({ _id }) =>
            AddressRepository.updateById(_id, { isDefault: false })
          )
        )

      const isDefault = !defaultAddress.length || data.isDefault

      await AddressRepository.updateById(id, {
        ...data,
        isDefault
      })

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)
      const user = await this.getUser(request)
      if (!user) return response.status(404)

      const address = await AddressRepository.findById(id)
      if (!address) return response.status(404)
      if (String(address.userId) !== String(user._id) && !user.isAdm)
        return response.status(401)

      await AddressRepository.deleteById(id)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
