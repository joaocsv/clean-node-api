import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { LoginController } from '../login/login'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()

  return {
    sut
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
