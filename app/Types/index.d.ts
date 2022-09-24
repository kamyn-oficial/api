export interface UserSchema {
  isAdm?: boolean
  name: string
  email: string
  phone?: string
  state?: string
  city?: string
  address?: string
  passwordHash?: string
  accessToken: string | null
  accessTokenExp: number | null
  resetPasswordToken?: string | null
  resetPasswordTokenExp?: number | null
  confirmationToken?: string | null
  confirmationTokenExp?: number | null
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
  password: string
  phone?: string
  state?: string
  city?: string
  address?: string
}

export interface UpdateUserParams {
  name: string
  phone: string
  state: string
  city: string
  address: string
}

export interface SearchUserParams {
  city?: string
  state?: string
  email?: string
  name?: string
}
