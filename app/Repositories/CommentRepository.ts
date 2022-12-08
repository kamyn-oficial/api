import CommentModel from 'App/Models/CommentModel'
import type { CommentSchema } from 'App/Types'

class CategoryRepository {
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
