import { SignUpValidatorFactory } from './signup-validator'
import { ValidatorComposite } from '../../../presentation/helpers/validator/validator-composite'
import { RequiredFieldValidator } from '../../../presentation/helpers/validator/required-field-validator'
import { Validator } from '../../../presentation/protocols/validator'
import { CompareFieldsValidator } from '../../../presentation/helpers/validator/compare-fields-validator'
import { EmailValidator } from '../../../presentation/helpers/validator/email-validator'
import { EmailValidator as IEmailValidator } from '../../../presentation/protocols/email-validator'

jest.mock('../../../presentation/helpers/validator/validator-composite')

const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUpValidator Factory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    new SignUpValidatorFactory().factory()

    const validators: Validator[] = []

    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validators.push(new EmailValidator('email', makeEmailValidatorStub()))

    expect(ValidatorComposite).toBeCalledWith(validators)
  })
})
