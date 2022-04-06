import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

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
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerSub()
  const logControllerDecorator = new LogControllerDecorator(controllerStub)

  return {
    sut: logControllerDecorator,
    controllerStub: controllerStub
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
})
