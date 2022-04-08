import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { AddLogErrorRepository } from '../../data/protocols/add-log-error-repository'

const makeAddLogErrorRepositoryStub = (): AddLogErrorRepository => {
  class AddLogErrorRepositoryStub implements AddLogErrorRepository {
    async add (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddLogErrorRepositoryStub()
}

const makeControllerSub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        }
      }

      return httpResponse
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
  const controllerStub = makeControllerSub()
  const addLogErrorRepositoryStub = makeAddLogErrorRepositoryStub()
  const logControllerDecorator = new LogControllerDecorator(controllerStub, addLogErrorRepositoryStub)

  return {
    sut: logControllerDecorator,
    controllerStub: controllerStub,
    addLogErrorRepositoryStub: addLogErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()

    const controllerStubSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(controllerStubSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, addLogErrorRepositoryStub } = makeSut()

    const error = serverError()
    error.body.stack = 'any_error'

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))

    const addLogErrorRepositorySpy = jest.spyOn(addLogErrorRepositoryStub, 'add')

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(addLogErrorRepositorySpy).toHaveBeenCalledWith('any_error')
  })
})
