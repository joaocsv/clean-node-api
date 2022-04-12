import { SignUpController } from './signup-controller'
import { MissingParamError, InvalidParamError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel, HttpRequest } from './signup-protocols'
import { ok, badRequest, serverError } from '../../helpers/http-helper'
import { Validator } from '../../helpers/validator/validator'

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  const addAccount = new AddAccountStub()

  return addAccount
}

interface SutTypes {
  sut: SignUpController
  validatorStub: Validator
  emailValidator: EmailValidator
  addAccount: AddAccount
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validatorStub)

  return {
    sut: sut,
    validatorStub,
    emailValidator: emailValidatorStub,
    addAccount: addAccountStub
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_mail@mail.com',
  password: 'valid_password'
})

describe('SignUpController', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut()

    const isValidMethod = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(isValidMethod).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(serverError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccount } = makeSut()

    const addAccountSpy = jest.spyOn(addAccount, 'add')

    await sut.handle(makeHttpRequest())

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccount } = makeSut()

    jest.spyOn(addAccount, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeHttpRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()

    const validateSpy = jest.spyOn(validatorStub, 'validate')

    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
