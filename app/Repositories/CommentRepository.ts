import CommentModel from 'App/Models/CommentModel'
import type { CommentSchema } from 'App/Types'

class CategoryRepository {
  public findAll(userId?: string) {
    return CommentModel.find({ userId })
  }

  public async getAll(current_page = 1, per_page = 15) {
    const skip = (current_page - 1) * per_page
    const data = await CommentModel.find().skip(skip).limit(per_page)
    const total = await CommentModel.countDocuments()
    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public create(schema: CommentSchema) {
    return new CommentModel(schema).save()
  }

  public deleteById(id: string) {
    return CommentModel.findByIdAndDelete(id)
  }

  public deleteByProductId(product: string) {
    return CommentModel.deleteMany({ product })
  }
}

export default new CategoryRepository()
