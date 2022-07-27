type RecipeCategory =
  | 'sopas e caldos'
  | 'salgados'
  | 'bolos'
  | 'doces'
  | 'sorvetes'
  | 'congelados'
  | 'verduras e legumes'
  | 'refeições'
  | 'lanches'
  | 'saladas'
  | 'sobremesas'
  | 'frutas'
  | 'bebidas'

export type CompanyType = 'vegetariano' | 'vegano' | 'orgânico'

interface CompanyContact {
  type: 'phone' | 'whatsapp'
  number: string
}

export type CompanyContacts = CompanyContact[]

export type Coordinates = [Number, Number]

export interface GooglePlace {
  shortAddress: string
  fullAddress: string
  reference: string
  city?: string
  coordinates: Coordinates
}

export interface UserSchema {
  name: string
  email: string
  emailVerified: boolean
  phone?: string
  state?: string
  city?: string
  address?: string
  passwordHash?: string
  accessToken: string | null
  accessTokenExp: number | null
  confirmationToken?: string | null
  confirmationTokenExp?: number | null
  resetPasswordToken?: string | null
  resetPasswordTokenExp?: number | null
  avatarUrl?: string
  companyId?: string
  isAdm?: boolean
  solicitation?: string
  createdAt?: Number
}

export interface CompanySchema {
  userId: string
  email: string
  searchable?: boolean
  name?: string
  shortAddress?: string
  fullAddress?: string
  city?: string
  location?: {
    type: 'Point'
    coordinates: Coordinates
  }
  type?: CompanyType
  operation?: string
  contacts?: CompanyContacts
  avatarUrl?: string
  facebook?: string
  instagram?: string
}

export interface RecipeSchema {
  companyId: string
  name: string
  picture1: string
  picture2: string
  picture3: string
  description: string
  price: number
  category: RecipeCategory
}

export interface JoiError {
  field: string | undefined
  message: string
}

export interface RegisterParams {
  name: string
  email: string
  password: string
  phone: string
  state: string
  city: string
  address: string
  avatarUrl?: string
}

export interface UpdateUserParams {
  entity: 'user' | 'company'
  name: string
  phone: string
  address: string
  state: string
  city: string
  solicitation: string
}

export interface UpdateCompanyParams {
  name: string
  address: string
  type: CompanyType
  operation: string
  contacts: CompanyContacts
  facebook: string
  instagram: string
  avatarUrl: string
  searchable: boolean
}

// eslint-disable-next-line prettier/prettier
export interface AddRecipeParams extends Omit<RecipeSchema, 'companyId'> { }

// eslint-disable-next-line prettier/prettier
export interface UpdateRecipeParams extends AddRecipeParams { }

export interface IndexRecipeParams {
  companyName: string
  recipeName?: string
}

export interface SearchUserParams {
  city?: string
  state?: string
  email?: string
  name?: string
}
