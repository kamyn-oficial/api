import ProductModel from 'App/Models/ProductModel'
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
    const data = await ProductModel.find(filter)
      .select(this.selectFields)
      .skip(skip)
      .limit(per_page)
      .populate('categories')
      .populate('sizes')
      .populate('comments')
    const total = await ProductModel.countDocuments()
    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public findById(id: string) {
    return ProductModel.findById(id)
  }

  public updateById(id: string, data: Partial<ProductSchema>) {
    return ProductModel.findByIdAndUpdate(id, data)
  }

  public deleteById(id: string) {
    return ProductModel.findByIdAndDelete(id)
  }
}

export default new ProductRepository()
