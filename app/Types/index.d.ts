export interface UserSchema {
  isAdm?: boolean
  name: string
  email: string
  phone?: string
  passwordHash: string
  accessToken?: string
  resetPasswordToken?: string
  confirmationToken?: string
  emailVerifiedAt?: Number
  createdAt?: Number
}

export interface JoiError {
  field: string | undefined
  message: string
}

export interface RegisterParams {
  name: string
  email: string
  phone?: string
  password: string
}

export interface UpdateUserParams {
  name: string
  phone: string
}

export interface AddressSchema {
  state: string
  city: string
  street: string
  zipcode: string
  userId?: string
  isDefault?: boolean
}

export type UpdateAddressParams = Omit<AddressSchema, 'userId'>
