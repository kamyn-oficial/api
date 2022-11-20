import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import CommentRepository from 'App/Repositories/CommentRepository'
import JoiValidateService from 'App/Services/JoiValidateService'
import JoiSchemas from 'App/JoiSchemas'

import type { CreateCommentParams } from 'App/Types'

export default class CommentController extends BaseController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const user = await this.getUser(request)
      if (!user) return this.responseIncorrectEmailOrPassword(response)

      const data: CreateCommentParams = request.only([
        'title',
        'text',
        'rate',
        'productId'
      ])

      const errors = JoiValidateService.validate(JoiSchemas.createComment, data)
      if (errors.length) return this.responseRequestError(response, errors)

      await CommentRepository.create({
        ...data,
        userId: user._id
      })

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
