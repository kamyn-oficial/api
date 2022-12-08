import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import CommentRepository from 'App/Repositories/CommentRepository'
import ProductRepository from 'App/Repositories/ProductRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { CreateCommentParams } from 'App/Types'
import UserRepository from 'App/Repositories/UserRepository'

export default class CommentController extends BaseController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const user = await this.getUser(request)
      if (!user) return this.responseNeedAuth(response)

      const data: CreateCommentParams = request.only([
        'title',
        'text',
        'rate',
        'product'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.createComment, data)
      if (errors.length) return this.responseRequestError(response, errors)

      const comment = await CommentRepository.create({
        ...data,
        user: user._id
      })

      await Promise.all([
        UserRepository.addComment(user._id, comment._id),
        ProductRepository.addComment(data.product, comment._id)
      ])

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      await CommentRepository.deleteById(id)

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
