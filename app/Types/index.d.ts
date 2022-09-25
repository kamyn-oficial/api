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
  name: string
  receiver: string
  neighborhood: string
  state: string
  city: string
  street: string
  number: number
  complement?: string
  reference?: string
  zipcode: string
  userId?: string
  isDefault?: boolean
}

export type UpdateAddressParams = Omit<AddressSchema, 'userId'>
