import { HttpRequest, HttpResponse, Controller, AddAccount } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Validator } from '../../helpers/validator/validator'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validator: Validator

  constructor (addAccount: AddAccount, validator: Validator) {
    this.addAccount = addAccount
    this.validator = validator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorValidator = this.validator.validate(httpRequest.body)
      if (errorValidator) {
        return badRequest(errorValidator)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
