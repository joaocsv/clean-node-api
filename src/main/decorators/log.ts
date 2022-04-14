import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { AddLogErrorRepository } from '../../data/protocols/db/add-log-error-repository'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly addLogErrorRepository: AddLogErrorRepository

  constructor (controller: Controller, addLogErroRepository: AddLogErrorRepository) {
    this.controller = controller
    this.addLogErrorRepository = addLogErroRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.addLogErrorRepository.addError(httpResponse.body.stack)
    }

    return httpResponse
  }
}
