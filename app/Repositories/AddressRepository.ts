import AddressModel from 'App/Models/AddressModel'
import type { AddressSchema, UpdateAddressParams } from 'App/Types'

class AddressRepository {
  public create(schema: AddressSchema) {
    return new AddressModel(schema).save()
  }

  public findByUserId(id: string) {
    return AddressModel.find({ userId: id })
  }

  public updateById(id: string, schema: UpdateAddressParams) {
    return AddressModel.findByIdAndUpdate(id, schema)
  }

  public deleteById(id: string) {
    return AddressModel.findByIdAndDelete(id)
  }
}

export default new AddressRepository()
