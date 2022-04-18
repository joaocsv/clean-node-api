import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { AddLogErrorRepository } from '../../data/protocols/db/log/add-log-error-repository'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly addLogErrorRepository: AddLogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.addLogErrorRepository.addError(httpResponse.body.stack)
    }

    return httpResponse
  }
}
