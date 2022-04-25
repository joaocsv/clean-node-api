import { Factory } from '../../factory'
import { Validator } from '../../../../presentation/protocols/validator'
import { RequiredFieldValidator, EmailValidator, ValidatorComposite } from '../../../../presentation/helpers/validator'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export class LoginValidatorFactory implements Factory<Validator> {
  factory (): Validator {
    const validators: Validator[] = []

    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

    return new ValidatorComposite(validators)
  }
}
