import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Authentication, Validator } from './login-controller-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const resultValidator = this.validator.validate(httpRequest.body)
      if (resultValidator) {
        return badRequest(resultValidator)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError()
    }
  }
}
