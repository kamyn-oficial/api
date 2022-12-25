import AddressModel from 'App/Models/AddressModel'
import type { AddressSchema, UpdateAddressParams } from 'App/Types'

class AddressRepository {
  public create(schema: AddressSchema) {
    return new AddressModel(schema).save()
  }

  public defaultAddress(userId: string) {
    return AddressModel.find({ userId, isDefault: true }).sort({
      createdAt: -1
    })
  }

  public findById(id: string) {
    return AddressModel.findById(id)
  }

  public findByUserId(userId: string) {
    return AddressModel.find({ userId }).sort({ createdAt: -1 })
  }

  public updateById(id: string, schema: Partial<UpdateAddressParams>) {
    return AddressModel.findByIdAndUpdate(id, schema)
  }

  public deleteById(id: string) {
    return AddressModel.findByIdAndDelete(id)
  }
}

export default new AddressRepository()
