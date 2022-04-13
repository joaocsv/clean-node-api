import { makeSignUpValidator } from './signup-validator'
import { ValidatorComposite } from '../../presentation/helpers/validator/validator-composite'
import { RequiredFieldValidator } from '../../presentation/helpers/validator/required-field-validator'
import { Validator } from '../../presentation/helpers/validator/validator'
import { CompareFieldsValidator } from '../../presentation/helpers/validator/compare-fields-validator'

jest.mock('../../presentation/helpers/validator/validator-composite')

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    makeSignUpValidator()

    const validators: Validator[] = []

    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))

    expect(ValidatorComposite).toBeCalledWith(validators)
  })
})
