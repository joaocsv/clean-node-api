import { ServerError } from '../errors/server-error'
import { HttpResponse } from '../protocols/http'

export const ok = (response: any): HttpResponse => {
  return {
    statusCode: 200,
    body: response
  }
}

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}