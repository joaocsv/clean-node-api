import { SignUpController } from './signup-controller'
import { MissingParamError } from '../../errors'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest } from './signup-protocols'
import { ok, badRequest, serverError } from '../../helpers/http/http-helper'
import { Validator } from '../../protocols/validator'

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

interface SutTypes {
  sut: SignUpController
  validatorStub: Validator
  addAccount: AddAccount
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(addAccountStub, validatorStub)

  return {
    sut: sut,
    validatorStub,
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
