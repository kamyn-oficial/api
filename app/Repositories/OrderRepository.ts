import AddressModel from 'App/Models/AddressModel'
import OrderModel from 'App/Models/OrderModel'
import ProductModel from 'App/Models/ProductModel'
import SizeModel from 'App/Models/SizeModel'
import UserModel from 'App/Models/UserModel'
import type { OrderSchema } from 'App/Types'

class SizeRepository {
  public create(schema: OrderSchema) {
    return new OrderModel(schema).save()
  }

  public findAll(user = '') {
    if (user) {
      return OrderModel.find({ user })
        .populate({ path: 'products.product', model: ProductModel })
        .populate({ path: 'products.size', model: SizeModel })
        .populate({ path: 'user', model: UserModel })
        .populate({ path: 'address', model: AddressModel })
    }
    return OrderModel.find()
      .populate({ path: 'products.product', model: ProductModel })
      .populate({ path: 'products.size', model: SizeModel })
      .populate({ path: 'user', model: UserModel })
      .populate({ path: 'address', model: AddressModel })
  }

  public async getAll(current_page = 1, per_page = 15) {
    const skip = (current_page - 1) * per_page
    const data = await OrderModel.find()
      .populate({ path: 'products.product', model: ProductModel })
      .populate({ path: 'user', model: UserModel })
      .populate({ path: 'address', model: AddressModel })
      .skip(skip)
      .limit(per_page)
    const total = await OrderModel.countDocuments()
    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public findById(id: string) {
    return OrderModel.findById(id)
      .populate({ path: 'products.product', model: ProductModel })
      .populate({ path: 'user', model: UserModel })
  }

  public updateById(id: string, schema: Partial<OrderSchema>) {
    return OrderModel.findByIdAndUpdate(id, schema)
  }
}

export default new SizeRepository()
