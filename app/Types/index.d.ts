export interface UserSchema {
  isAdm?: boolean
  name: string
  email: string
  cpf: string
  phone?: string
  passwordHash: string
  accessToken?: string
  resetPasswordToken?: string
  confirmationToken?: string
  createdAt?: number
}

export interface OrderSchema {
  user: any
  address: any
  comment?: string
  status: string
  products: {
    product: any
    count: number
    size: string
    color: string
  }
  paymentMethod: string
  paymentUrl?: string
  trackcode?: string
  payAt?: number
  createdAt?: number
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
  createdAt?: number
}

export interface BannerSchema {
  photo: string
  title: string
  subtitle: string
  button: string
  link: string
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
  product: string
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
  cpf: string
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
  cpf: string
  password: string
  phone?: string
  isAdm?: boolean
}

export type UpdateUserParams = CreateUserParams

export interface AddressSchema {
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

export type BannerParams = BannerSchema
