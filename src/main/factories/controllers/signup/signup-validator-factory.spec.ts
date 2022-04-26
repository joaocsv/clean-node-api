import { SignUpValidatorFactory } from './signup-validator-factory'
import { Validator } from '../../../../presentation/protocols/validator'
import { EmailValidator as IEmailValidator } from '../../../../validation/protocols/email-validator'
import { EmailValidator, CompareFieldsValidator, RequiredFieldValidator, ValidatorComposite } from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validator-composite')

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
