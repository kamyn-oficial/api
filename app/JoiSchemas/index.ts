import Joi from 'joi'
import {
  RegisterParams,
  CreateUserParams,
  UpdateAddressParams,
  UpdateMeUserParams,
  UpdateProductParams,
  UpdateCategoryParams,
  UpdateSizeParams,
  CreateCommentParams,
  BannerParams
} from 'App/Types'

const validCPF = cpf => {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (
    cpf === '' ||
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  )
    return false
  let add = 0
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i)
  let rev = 11 - (add % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cpf.charAt(9))) return false
  add = 0
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i)
  rev = 11 - (add % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(cpf.charAt(10))) return false
  return true
}

class JoiSchemas {
  public name = Joi.string()
    .max(64)
    .error(err => {
      err[0].message = 'Nome inválido'
      err[0].path = ['name']
      return err[0]
    })

  public email = Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'br'] } })
    .error(err => {
      err[0].message = 'Email inválido'
      err[0].path = ['email']
      return err[0]
    })

  public cpf = Joi.string()
    .min(11)
    .max(11)
    .custom((value, helpers) => {
      if (!validCPF(value)) return helpers.error('any.invalid')
    })
    .error(err => {
      err[0].message = 'CPF inválido'
      err[0].path = ['cpf']
      return err[0]
    })

  public phone = Joi.string()
    .min(11)
    .max(11)
    .error(err => {
      err[0].message = 'Telefone precisa ter 11 números'
      err[0].path = ['phone']
      return err[0]
    })

  public password = Joi.string().error(err => {
    err[0].path = ['password']
    return err[0]
  })

  public state = Joi.string()
    .max(64)
    .error(err => {
      err[0].message = 'Estado inválido'
      err[0].path = ['state']
      return err[0]
    })

  public city = Joi.string()
    .max(64)
    .error(err => {
      err[0].message = 'Cidade inválida'
      err[0].path = ['city']
      return err[0]
    })

  public zipcode = Joi.number().error(err => {
    err[0].message = 'Zipcode inválido'
    err[0].path = ['zipcode']
    return err[0]
  })

  public street = Joi.string()
    .min(6)
    .max(64)
    .error(err => {
      err[0].message = 'Tamanho da rua inválido'
      err[0].path = ['street']
      return err[0]
    })

  public picture = Joi.string().error(err => {
    err[0].message = 'Foto inválida'
    err[0].path = ['picture']
    return err[0]
  })

  public description = Joi.string()
    .max(512)
    .error(err => {
      err[0].message = 'Descrição inválida'
      err[0].path = ['description']
      return err[0]
    })

  public price = Joi.number().error(err => {
    err[0].message = 'Preço não informado'
    err[0].path = ['price']
    return err[0]
  })

  public get register() {
    return Joi.object<RegisterParams>({
      name: this.name.required(),
      email: this.email.required(),
      cpf: this.cpf.required(),
      password: this.password.required(),
      phone: this.phone
    })
  }

  public get createUser() {
    return Joi.object<CreateUserParams>({
      name: this.name.required(),
      email: this.email.required(),
      password: this.password.required(),
      phone: this.phone,
      isAdm: Joi.boolean()
    })
  }

  public get updateUser() {
    return this.createUser
  }

  public get updateMeUser() {
    return Joi.object<UpdateMeUserParams>({
      name: this.name,
      phone: this.phone,
      cpf: this.cpf
    })
  }

  public get updateAddress() {
    return Joi.object<UpdateAddressParams>({
      name: Joi.string().required(),
      receiver: Joi.string().required(),
      neighborhood: Joi.string().required(),
      number: Joi.number().required(),
      complement: Joi.string(),
      reference: Joi.string(),
      state: this.state.required(),
      city: this.city.required(),
      street: this.street.required(),
      zipcode: this.zipcode.required(),
      isDefault: Joi.boolean()
    })
  }

  public get updateProduct() {
    return Joi.object<UpdateProductParams>({
      name: Joi.string().required(),
      description: this.description.required(),
      price: this.price.required(),
      categories: Joi.array().items(Joi.string()).required(),
      colors: Joi.array().items(Joi.string()).required(),
      photos: Joi.array().items(Joi.string()).required(),
      sizes: Joi.array().items(Joi.string()).required(),
      promotion: Joi.number(),
      quantity: Joi.number().required()
    })
  }

  public get updateCategory() {
    return Joi.object<UpdateCategoryParams>({
      name: Joi.string().required()
    })
  }

  public get createComment() {
    return Joi.object<CreateCommentParams>({
      title: Joi.string().required(),
      text: Joi.string().required(),
      rate: Joi.number().min(1).max(5).required(),
      product: Joi.string().required()
    })
  }

  public get updateSize() {
    return Joi.object<UpdateSizeParams>({
      name: Joi.string().required()
    })
  }

  public get createOrUpdateBanner() {
    return Joi.object<BannerParams>({
      photo: Joi.string().required(),
      title: Joi.string().required(),
      subtitle: Joi.string().required(),
      button: Joi.string().required(),
      link: Joi.string().required()
    })
  }
}

export default new JoiSchemas()
