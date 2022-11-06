import CategoryModel from 'App/Models/CategoryModel'
import type { CategorySchema } from 'App/Types'

class CategoryRepository {
  public create(schema: CategorySchema) {
    return new CategoryModel(schema).save()
  }

  public readonly selectFields = ['_id', 'name']

  public findAll() {
    return CategoryModel.find()
  }

  public async getAll(current_page = 1, per_page = 15) {
    const skip = (current_page - 1) * per_page
    const data = await CategoryModel.find()
      .select(this.selectFields)
      .skip(skip)
      .limit(per_page)
    const total = await CategoryModel.countDocuments()
    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public findById(id: string) {
    return CategoryModel.findById(id)
  }

  public updateById(id: string, data: Partial<CategorySchema>) {
    return CategoryModel.findByIdAndUpdate(id, data)
  }

  public deleteById(id: string) {
    return CategoryModel.findByIdAndDelete(id)
  }
}

export default new CategoryRepository()
