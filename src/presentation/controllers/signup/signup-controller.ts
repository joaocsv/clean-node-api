import { HttpRequest, HttpResponse, Controller, AddAccount, Authentication } from './signup-controller-protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { Validator } from '../../protocols/validator'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidator = this.validator.validate(httpRequest.body)
      if (errorValidator) {
        return badRequest(errorValidator)
      }

      const { name, email, password } = httpRequest.body

      await this.addAccount.add({
        name,
        email,
        password
      })

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return ok({ accessToken })
    } catch (error) {
      return serverError()
    }
  }
}
