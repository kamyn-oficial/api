import ProductModel from 'App/Models/ProductModel'
import CategoryModel from 'App/Models/CategoryModel'
import CommentModel from 'App/Models/CommentModel'
import SizeModel from 'App/Models/SizeModel'
import type { ProductSchema } from 'App/Types'

class ProductRepository {
  public create(schema: ProductSchema) {
    return new ProductModel(schema).save()
  }

  public readonly selectFields = [
    '_id',
    'name',
    'price',
    'promotion',
    'description',
    'quantity',
    'categories',
    'photos',
    'colors',
    'sizes',
    'createdAt'
  ]

  public async getAll(current_page = 1, per_page = 15, filter: any) {
    const skip = (current_page - 1) * per_page

    let [data, total] = await Promise.all([ProductModel.find(filter)
      .select(this.selectFields)
      .skip(skip)
      .limit(per_page)
      .populate({ path: 'sizes', model: SizeModel })
      .populate({ path: 'categories', model: CategoryModel })
      .populate({ path: 'comments', model: CommentModel }), ProductModel.countDocuments()])

    data = data.map((item: any) => {
      return {
        ...item._doc,
        rating: item.comments.length > 0 ? item.comments.reduce((a: any, b: any) => a + b.rating, 0) / item.comments.length : 0
      }
    })

    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public findById(id: string) {
    return ProductModel.findById(id)
      .populate({ path: 'sizes', model: SizeModel })
      .populate({ path: 'categories', model: CategoryModel })
      .populate({ path: 'comments', model: CommentModel }), ProductModel.countDocuments()])
  }

  public updateById(id: string, data: Partial<ProductSchema>) {
    return ProductModel.findByIdAndUpdate(id, data)
  }

  public deleteById(id: string) {
    return ProductModel.findByIdAndDelete(id)
  }
}

export default new ProductRepository()
