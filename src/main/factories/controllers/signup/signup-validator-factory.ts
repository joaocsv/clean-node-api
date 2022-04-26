import { Factory } from '../../factory'
import { Validator } from '../../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { ValidatorComposite, RequiredFieldValidator, EmailValidator, CompareFieldsValidator } from '../../../../validation/validators'

export class SignUpValidatorFactory implements Factory <Validator> {
  factory (): Validator {
    const validators: Validator[] = []

    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

    return new ValidatorComposite(validators)
  }
}
