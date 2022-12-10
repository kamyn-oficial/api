import UserModel from 'App/Models/UserModel'
import type { UserSchema } from 'App/Types'

class UserRepository {
  public create(schema: UserSchema) {
    return new UserModel(schema).save()
  }

  public readonly selectFields = [
    '_id',
    'name',
    'email',
    'password',
    'accessTokenExp',
    'isAdm',
    'createdAt'
  ]

  public async getAll(current_page = 1, per_page = 15) {
    const skip = (current_page - 1) * per_page
    const data = await UserModel.find()
      .select(this.selectFields)
      .skip(skip)
      .limit(per_page)
    const total = await UserModel.countDocuments()
    return {
      data,
      current_page,
      per_page,
      total
    }
  }

  public async addComment(userId: string, commentId: string) {
    const data: any = await UserModel.findById(userId)
    data.comments.push(commentId)
    return data.save()
  }

  public existByEmail(email: string) {
    return UserModel.exists({ email })
  }

  public async isAdm(id: string) {
    const user = await UserModel.findById(id)
    return !!user?.isAdm
  }

  public findByEmail(email: string) {
    return UserModel.findOne({ email })
  }

  public findById(id: string) {
    return UserModel.findById(id)
  }

  public findByAccessToken(accessToken: string) {
    return UserModel.findOne({ accessToken })
  }

  public changeAccessTokenByEmail(email: string, accessToken: string) {
    return UserModel.findOneAndUpdate({ email }, { accessToken })
  }

  public resetPassword(resetPasswordToken: string, passwordHash: string) {
    return UserModel.findOneAndUpdate(
      { resetPasswordToken },
      {
        passwordHash,
        resetPasswordToken: undefined
      }
    )
  }

  public changeResetPasswordTokenByEmail(
    email: string,
    resetPasswordToken: string
  ) {
    return UserModel.findOneAndUpdate({ email }, { resetPasswordToken })
  }

  public findByResetPasswordToken(resetPasswordToken: string) {
    return UserModel.findOne({ resetPasswordToken })
  }

  public updateByAccessToken(accessToken: string, data: Partial<UserSchema>) {
    return UserModel.findOneAndUpdate({ accessToken }, { ...data })
  }

  public updateById(id: string, data: Partial<UserSchema>) {
    return UserModel.findByIdAndUpdate(id, { ...data })
  }

  public deleteById(id: string) {
    return UserModel.findByIdAndDelete(id)
  }

  public async logout(accessToken: string) {
    return UserModel.findOneAndUpdate(
      { accessToken },
      {
        accessToken: undefined
      }
    )
  }
}

export default new UserRepository()
