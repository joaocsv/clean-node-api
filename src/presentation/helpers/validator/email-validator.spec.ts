import { EmailValidator } from './email-validator'
import { EmailValidator as IEmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors'

const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidator
  emailValidatorStub: IEmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidator('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidator', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const resultValidator = sut.validate({ email: 'invalid_email@mail.com' })

    expect(resultValidator).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidMethod = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({
      email: 'any_email@mail.com'
    })

    expect(isValidMethod).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
