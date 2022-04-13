import { CompareFieldsValidator } from '../../presentation/helpers/validator/compare-fields-validator'
import { EmailValidator } from '../../presentation/helpers/validator/email-validator'
import { RequiredFieldValidator } from '../../presentation/helpers/validator/required-field-validator'
import { Validator } from '../../presentation/helpers/validator/validator'
import { ValidatorComposite } from '../../presentation/helpers/validator/validator-composite'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpValidator = (): Validator => {
  const validators: Validator[] = []

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}
