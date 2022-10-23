import UserModel from 'App/Models/UserModel'
import type { UserSchema } from 'App/Types'

class UserRepository {
  public create(schema: UserSchema) {
    return new UserModel({ ...schema, createdAt: new Date().getTime() }).save()
  }

  public async getAll(page = 1) {
    const PAGE_SIZE = 2;                   // Similar to 'limit'
    const skip = (page - 1) * PAGE_SIZE;    // For page 1, the skip is: (1 - 1) * 20 => 0 * 20 = 0
    const data = await UserModel.find().skip(skip).limit(PAGE_SIZE)
    const total = await UserModel.countDocuments()
    return {
      data,
      current_page: 1,
      per_page: 0,
      total,
    }
  }

  public existByEmail(email: string) {
    return UserModel.exists({ email })
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

  public confirmEmail(confirmationToken: string) {
    return UserModel.findOneAndUpdate(
      { confirmationToken },
      {
        emailVerified: true,
        confirmationToken: undefined
      }
    )
  }
}

export default new UserRepository()
