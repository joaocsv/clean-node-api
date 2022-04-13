import { Validator } from '../../../presentation/helpers/validator/validator'
import { LoginValidatorFactory } from './login-validator'
import { ValidatorComposite } from '../../../presentation/helpers/validator/validator-composite'
import { EmailValidator } from '../../../presentation/helpers/validator/email-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { RequiredFieldValidator } from '../../../presentation/helpers/validator/required-field-validator'

jest.mock('../../../presentation/helpers/validator/validator-composite')

describe('LoginValidator factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    new LoginValidatorFactory().factory()

    const validators: Validator[] = []

    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new EmailValidator('email', new EmailValidatorAdapter()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
