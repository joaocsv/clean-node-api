import { SignUpController } from './signup-controller'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest, Authentication, AuthenticationModel } from './signup-controller-protocols'
import { Validator } from '../../protocols/validator'
import { ok, badRequest, serverError } from '../../helpers/http/http-helper'
import { MissingParamError } from '../../errors'

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
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

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authenticationModel: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

interface SutTypes {
  sut: SignUpController
  validatorStub: Validator
  addAccountStub: AddAccount
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new SignUpController(addAccountStub, validatorStub, authenticationStub)

  return {
    sut,
    validatorStub,
    addAccountStub,
    authenticationStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_mail@mail.com',
  password: 'any_password'
})

describe('SignUpController', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeHttpRequest())

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()

    const validateSpy = jest.spyOn(validatorStub, 'validate')

    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validator returns an error', async () => {
    const { sut, validatorStub } = makeSut()

    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeHttpRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError())
  })
})
