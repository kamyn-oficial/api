export interface UserSchema {
  isAdm?: boolean
  name: string
  email: string
  phone?: string
  state?: string
  city?: string
  address?: string
  passwordHash: string
  accessToken?: string | null
  resetPasswordToken?: string | null
  confirmationToken?: string | null
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

export interface SearchUserParams {
  city?: string
  state?: string
  email?: string
  name?: string
}
