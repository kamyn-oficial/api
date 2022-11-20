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

export interface ProductSchema {
  name: string
  price: number
  promotion?: number
  description: string
  quantity: number
  categories: string[]
  photos: string[]
  colors: string[]
  sizes: string[]
  createdAt?: Number
}

export interface CategorySchema {
  name: string
}

export interface CommentSchema {
  text: string
  user: UserSchema
}

export interface CreateCommentParams {
  title: string
  text: string
  rate: number
  productId: string
}

export interface SizeSchema {
  name: string
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

export interface UpdateMeUserParams {
  name: string
  phone: string
}

export interface CreateUserParams {
  name: string
  email: string
  password: string
  phone?: string
  isAdm?: boolean
}

export interface UpdateUserParams extends CreateUserParams { }

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

export type UpdateProductParams = ProductSchema

export type UpdateCategoryParams = CategorySchema

export type UpdateSizeParams = SizeSchema
