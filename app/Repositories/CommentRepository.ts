import CommentModel from 'App/Models/CommentModel'
import type { CommentSchema } from 'App/Types'

class CategoryRepository {
  public create(schema: CommentSchema) {
    return new CommentModel(schema).save()
  }

  public deleteById(id: string) {
    return CommentModel.findByIdAndDelete(id)
  }
}

export default new CategoryRepository()
