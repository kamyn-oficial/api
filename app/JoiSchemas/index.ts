import Joi from 'joi'
import {
  AddRecipeParams,
  RegisterParams,
  UpdateCompanyParams,
  UpdateRecipeParams,
  UpdateUserParams
} from 'App/Types'

class JoiSchemas {
  public name = Joi.string()
    .min(4)
    .max(40)
    .error(err => {
      err[0].message = 'Nome deve conter no mínimo 4 e no máximo 40 caracteres'
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
    .max(32)

    .error(err => {
      err[0].message = 'Senha deve ter no mínimo 6 caracteres'
      err[0].path = ['password']
      return err[0]
    })

  public state = Joi.string().error(err => {
    err[0].message = 'Estado inválido'
    err[0].path = ['state']
    return err[0]
  })

  public city = Joi.string().error(err => {
    err[0].message = 'Cidade inválida'
    err[0].path = ['city']
    return err[0]
  })

  public address = Joi.string()
    .min(6)
    .error(err => {
      err[0].message =
        'Endereço é obrigatório e deve ter no mínimo 6 caracteres'
      err[0].path = ['address']
      return err[0]
    })

  public picture = Joi.string().error(err => {
    err[0].message = 'Foto inválida'
    err[0].path = ['picture']
    return err[0]
  })

  public description = Joi.string().error(err => {
    err[0].message = 'Descrição inválida'
    err[0].path = ['description']
    return err[0]
  })

  public price = Joi.number().error(err => {
    err[0].message = 'Preço não informado'
    err[0].path = ['price']
    return err[0]
  })

  public socialMediaUsername = Joi.string()
    .optional()
    .allow('')
    .pattern(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/im)
    .error(err => {
      err[0].message = 'Coloque apenas seu username sem o "@"'
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

      phone: this.phone.required(),

      state: this.state.required(),

      city: this.city.required(),

      address: Joi.string()
        .required()
        .error(err => {
          err[0].message = 'Endereço obrigatório'
          err[0].path = ['address']
          return err[0]
        })
    })
  }

  public get updateUser() {
    return Joi.object<UpdateUserParams>({
      entity: Joi.string()
        .valid('user', 'company')
        .error(err => {
          err[0].message = 'Entidade deve ser user ou company'
          return err[0]
        }),

      name: this.name,

      phone: this.phone,

      state: this.state,

      city: this.city,

      address: this.address,

      solicitation: Joi.string().allow('')
    })
  }

  public get updateCompany() {
    return Joi.object<UpdateCompanyParams>({
      avatarUrl: this.picture.error(err => {
        err[0].path = ['avatarUrl']
        return err[0]
      }),

      name: this.name,

      address: Joi.string()
        .required()
        .error(err => {
          err[0].message = 'Endereço não informado'
          return err[0]
        }),

      type: Joi.string()
        .valid('vegetariano', 'vegano', 'orgânico')
        .error(err => {
          err[0].message =
            'Tipo de negócio deve ser: vegetariano, vegano ou orgânico'
          return err[0]
        }),

      operation: Joi.string().error(err => {
        err[0].message = 'Dias e horários de funcionamento inválidos'
        return err[0]
      }),

      contacts: Joi.array()
        .items(
          Joi.object({
            type: Joi.string()
              .valid('phone', 'whatsapp')
              .error(err => {
                err[0].message = 'Tipo de contato precisa ser phone ou whatsapp'
                return err[0]
              })
              .required(),
            number: this.phone.required()
          })
        )
        .error(err => {
          err[0].path = ['contacts']
          return err[0]
        }),

      facebook: this.socialMediaUsername.error(err => {
        err[0].path = ['facebook']
        return err[0]
      }),

      instagram: this.socialMediaUsername.error(err => {
        err[0].path = ['instagram']
        return err[0]
      })
    })
  }

  public get addRecipe() {
    return Joi.object<AddRecipeParams>({
      name: this.name.required(),

      picture1: this.picture.required(),

      description: this.description.required(),

      price: this.price.required(),

      category: this.category.required()
    }).options({ stripUnknown: true })
  }

  public get updateRecipe() {
    return Joi.object<UpdateRecipeParams>({
      name: this.name,

      picture1: this.picture,

      picture2: this.picture,

      picture3: this.picture,

      description: this.description,

      price: this.price,

      category: this.category
    })
  }
}

export default new JoiSchemas()
