import { Validator } from '../../../presentation/protocols/validator'
import { LoginValidatorFactory } from './login-validator-factory'
import { EmailValidator, RequiredFieldValidator, ValidatorComposite } from '../../../presentation/helpers/validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

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
