import { ok, serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
import { AddLogErrorRepository } from '../../data/protocols/db/log/add-log-error-repository'
import { AccountModel } from '../../domain/models/account'

const makeAddLogErrorRepositoryStub = (): AddLogErrorRepository => {
  class AddLogErrorRepositoryStub implements AddLogErrorRepository {
    async addError (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddLogErrorRepositoryStub()
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return ok(makeFakeAccountModel())
    }
  }

  return new ControllerStub()
}

interface SutTypes {
  sut: Controller
  controllerStub: Controller
  addLogErrorRepositoryStub: AddLogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const addLogErrorRepositoryStub = makeAddLogErrorRepositoryStub()
  const logControllerDecorator = new LogControllerDecorator(controllerStub, addLogErrorRepositoryStub)

  return {
    sut: logControllerDecorator,
    controllerStub: controllerStub,
    addLogErrorRepositoryStub: addLogErrorRepositoryStub
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

const makeHttpServerError = (): HttpResponse => {
  const error = serverError()
  error.body.stack = 'any_error'

  return error
}

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()

    const controllerStubSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeHttpRequest())

    expect(controllerStubSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccountModel()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, addLogErrorRepositoryStub } = makeSut()

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeHttpServerError()))

    const addLogErrorRepositorySpy = jest.spyOn(addLogErrorRepositoryStub, 'addError')

    await sut.handle(makeFakeHttpRequest())

    expect(addLogErrorRepositorySpy).toHaveBeenCalledWith('any_error')
  })
})
