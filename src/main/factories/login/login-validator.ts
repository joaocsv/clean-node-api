import { Factory } from '../factory'
import { Validator } from '../../../presentation/protocols/validator'
import { ValidatorComposite } from '../../../presentation/helpers/validator/validator-composite'
import { RequiredFieldValidator } from '../../../presentation/helpers/validator/required-field-validator'
import { EmailValidator } from '../../../presentation/helpers/validator/email-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

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
