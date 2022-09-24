import UserModel from 'App/Models/UserModel'
import type { UserSchema, SearchUserParams } from 'App/Types'

class UserRepository {
  public create(schema: UserSchema) {
    return new UserModel({ ...schema, createdAt: new Date().getTime() }).save()
  }

  public existByEmail(email: string) {
    return UserModel.exists({ email })
  }

  public findByEmail(email: string) {
    return UserModel.findOne({ email })
  }

  public search({ city, state, email, name }: SearchUserParams) {
    return UserModel.find({
      city: city ? RegExp(city, 'i') : undefined,
      state: state ? RegExp(state, 'i') : undefined,
      email,
      name: name ? RegExp(`^${name}$`, 'i') : undefined
    })
  }

  public findById(id: string) {
    return UserModel.findById(id)
  }

  public findByAccessToken(accessToken: string) {
    return UserModel.findOne({ accessToken })
  }

  public changeAccessTokenByEmail(
    email: string,
    accessToken: string,
    accessTokenExp: number
  ) {
    return UserModel.findOneAndUpdate(
      { email },
      { accessToken, accessTokenExp }
    )
  }

  public changePasswordHashByAccessToken(
    accessToken: string,
    passwordHash: string
  ) {
    return UserModel.findOneAndUpdate({ accessToken }, { passwordHash })
  }

  public resetPassword(resetPasswordToken: string, passwordHash: string) {
    return UserModel.findOneAndUpdate(
      { resetPasswordToken },
      {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExp: null
      }
    )
  }

  public changeResetPasswordTokenByEmail(
    email: string,
    resetPasswordToken: string,
    resetPasswordTokenExp: number
  ) {
    return UserModel.findOneAndUpdate(
      { email },
      { resetPasswordToken, resetPasswordTokenExp }
    )
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
        accessToken: null,
        accessTokenExp: null
      }
    )
  }

  public confirmEmail(confirmationToken: string) {
    return UserModel.findOneAndUpdate(
      { confirmationToken },
      {
        emailVerified: true,
        confirmationToken: null,
        confirmationTokenExp: null
      }
    )
  }
}

export default new UserRepository()
