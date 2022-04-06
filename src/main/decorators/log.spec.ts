import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
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

    const controllerStub = new ControllerStub()
    const controllerStubSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const logControllerDecorator = new LogControllerDecorator(controllerStub)

    await logControllerDecorator.handle(httpRequest)

    expect(controllerStubSpy).toHaveBeenCalledWith(httpRequest)
  })
})
