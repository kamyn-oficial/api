import BannerModel from 'App/Models/BannerModel'
import type { BannerSchema } from 'App/Types'

class BannerRepository {
  public create(schema: BannerSchema) {
    return new BannerModel(schema).save()
  }

  public findAll() {
    return BannerModel.find().sort({ createdAt: -1 })
  }

  public async getAll(current_page = 1, per_page = 15) {
    const skip = (current_page - 1) * per_page
    const data = await BannerModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(per_page)
    const total = await BannerModel.countDocuments()
    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public updateById(id: string, data: Partial<BannerSchema>) {
    return BannerModel.findByIdAndUpdate(id, data)
  }

  public deleteById(id: string) {
    return BannerModel.findByIdAndDelete(id)
  }
}

export default new BannerRepository()
