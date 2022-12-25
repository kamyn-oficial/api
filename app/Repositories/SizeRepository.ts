import SizeModel from 'App/Models/SizeModel'
import type { SizeSchema } from 'App/Types'

class SizeRepository {
  public create(schema: SizeSchema) {
    return new SizeModel(schema).save()
  }

  public readonly selectFields = ['_id', 'name']

  public findAll() {
    return SizeModel.find().sort({ createdAt: -1 })
  }

  public async getAll(current_page = 1, per_page = 15) {
    const skip = (current_page - 1) * per_page
    const data = await SizeModel.find()
      .sort({ createdAt: -1 })
      .select(this.selectFields)
      .skip(skip)
      .limit(per_page)
    const total = await SizeModel.countDocuments()
    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public findById(id: string) {
    return SizeModel.findById(id)
  }

  public updateById(id: string, data: Partial<SizeSchema>) {
    return SizeModel.findByIdAndUpdate(id, data)
  }

  public deleteById(id: string) {
    return SizeModel.findByIdAndDelete(id)
  }
}

export default new SizeRepository()
