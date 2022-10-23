import Joi from 'joi'
import {
  RegisterParams,
  CreateUserParams,
  UpdateAddressParams,
  UpdateMeUserParams
} from 'App/Types'

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

  public phone = Joi.string()
    .min(11)
    .max(11)
    .error(err => {
      err[0].message = 'Telefone precisa ter 11 números'
      err[0].path = ['phone']
      return err[0]
    })

  public password = Joi.string()
    .min(6)
    .max(64)
    .error(err => {
      err[0].message = 'Senha deve ter no mínimo 6 caracteres'
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

  public category = Joi.string()
    .valid(
      'sopas e caldos',
      'salgados',
      'bolos',
      'doces',
      'sorvetes',
      'congelados',
      'verduras e legumes',
      'refeições',
      'lanches',
      'saladas',
      'sobremesas',
      'frutas',
      'bebidas'
    )
    .error(err => {
      err[0].message = 'Categoria inválida'
      err[0].path = ['category']
      return err[0]
    })

  public get register() {
    return Joi.object<RegisterParams>({
      name: this.name.required(),
      email: this.email.required(),
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
      isAdm: Joi.boolean(),
    })
  }

  public get updateUser() {
    return this.createUser
  }

  public get updateMeUser() {
    return Joi.object<UpdateMeUserParams>({
      name: this.name,
      phone: this.phone
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
}

export default new JoiSchemas()
