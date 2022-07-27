import { JoiError } from 'App/Types'
import { Schema } from 'joi'

class JoiValidateService {
  public validate<T>(schema: Schema<T>, objectToValidate: T) {
    const { error } = schema.validate(objectToValidate, { abortEarly: false })

    if (!error) return []

    const errors: JoiError[] = error.details.map(
      ({ message, path, context }) => {
        const field = String(path[0]) || context?.key

        return {
          field,
          message
        }
      }
    )

    return errors
  }
}

export default new JoiValidateService()
