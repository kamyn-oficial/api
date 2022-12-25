import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BaseController'
import OrderRepository from 'App/Repositories/OrderRepository'

export default class OrderController extends BaseController {
  public async index({ request, response }: HttpContextContract) {
    try {
      const params = request.only(['page', 'per_page', 'all'])
      const page = Number(params.page || 1)
      const perPage = Number(params.per_page || 15)
      if (params.all) {
        const orders = await OrderRepository.findAll()
        return response.json(orders)
      }
      const pagination = await OrderRepository.getAll(page, perPage)
      return response.json(pagination)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async listUserLogged({ request, response }: HttpContextContract) {
    try {
      const user = await this.getUserId(request)
      const orders = await OrderRepository.findAll(user)
      return response.json(orders)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const user = await this.getUser(request)
      if (!user) return response.status(401)

      const id = decodeURI(request.params().id)

      const order = await OrderRepository.findById(id)
      if (!order) return response.status(404)
      if (String(order.user) !== String(user._id) && !user.isAdm)
        return response.status(401)

      return response.json(order)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async notification({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['topic', 'id'])

      if (data.topic === 'payment') {
        const mpData = await this.MP.payment.get(data.id)
        const approved = mpData.response.status === 'approved'
        if (!approved) return response.status(200)
        const orderId = mpData.response.external_reference.split(':')[1]
        await OrderRepository.updateById(orderId, {
          status: 'invoiced',
          payAt: new Date().getTime()
        })
        return response.status(200)
      }

      return response.status(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const user = await this.getUser(request)
      if (!user) return response.status(401)

      const data = request.only([
        'address',
        'comment',
        'products',
        'paymentMethod'
      ])

      const created = await OrderRepository.create({
        ...data,
        user: user._id,
        status: 'created'
      })

      const order = await OrderRepository.findById(created._id)
      if (!order) return response.status(404)

      const payload: any = {
        transaction_amount: Number(
          data.products
            .reduce((acc, cur: any) => acc + cur.price * cur.count, 0)
            .toFixed(2)
        ),
        date_of_expiration: new Date(
          new Date().setDate(new Date().getDate() + 1)
        ).toISOString(),
        notification_url: `https://kamyn.com.br/api/order/notification`,
        description: (order.products as any)
          .map((p: any) => `${p.count}x ${p.product.name}`)
          .join(', '),
        external_reference: `${user._id}:${order._id}`,
        payment_method_id: data.paymentMethod,
        installments: 1,
        payer: {
          first_name: user.name.split(' ').slice(0, -1).join(' ') || user.name,
          last_name: user.name.split(' ').slice(-1).join(' '),
          email: user.email,
          identification: {
            type: 'CPF',
            number: user.cpf
          }
        }
      }

      const getPaymentUrl = mpResponse => {
        switch (true) {
          case mpResponse.payment_method_id === 'bolbradesco':
            return mpResponse.transaction_details.external_resource_url

          case mpResponse.payment_method_id === 'pix':
            return mpResponse.response.point_of_interaction.transaction_data
              .ticket_url

          default:
            return ''
        }
      }

      const mpData = await this.MP.payment.create(payload)

      if (mpData.status === 201) {
        console.log('Pagamento expedido', mpData.response)
        const paymentUrl = getPaymentUrl(mpData.response)
        if (!paymentUrl)
          throw new Error('Não foi possível gerar o link de pagamento')
        await OrderRepository.updateById(order.id, { paymentUrl })
        return response.json({ payload, mpData, paymentUrl })
      } else {
        return this.responseRequestError(response, [
          {
            field: '',
            message: 'Não foi possível criar o pedido'
          }
        ])
      }
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }

  public async cancel({ request, response }: HttpContextContract) {
    try {
      const id = decodeURI(request.params().id)

      const order = await OrderRepository.findById(id)
      if (!order) return response.status(404)

      if (!['created'].includes(order.status)) {
        return this.responseRequestError(response, [
          {
            field: '',
            message: 'Não é possível cancelar um pedido que já foi enviado'
          }
        ])
      }

      await OrderRepository.updateById(id, {
        status: 'canceled'
      })

      return response.safeStatus(200)
    } catch (error) {
      return this.responseSomethingWrong(response, error)
    }
  }
}
