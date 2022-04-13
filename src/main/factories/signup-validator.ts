import { CompareFieldsValidator } from '../../presentation/helpers/validator/compare-fields-validator'
import { RequiredFieldValidator } from '../../presentation/helpers/validator/required-field-validator'
import { Validator } from '../../presentation/helpers/validator/validator'
import { ValidatorComposite } from '../../presentation/helpers/validator/validator-composite'

export const makeSignUpValidator = (): Validator => {
  const validators: Validator[] = []

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))

  return new ValidatorComposite(validators)
}
