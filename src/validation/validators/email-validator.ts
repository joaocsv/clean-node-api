import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator as IEmailValidator } from '../protocols/email-validator'
import { Validator } from '../../presentation/protocols/validator'

export class EmailValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator
  ) {}

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])

    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
