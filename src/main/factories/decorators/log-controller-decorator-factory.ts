import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Factory } from '../factory'

export class LogControllerDecoratorFactory implements Factory<Controller> {
  constructor (private readonly controller: Controller) {}

  factory (): Controller {
    const logMongoRepository = new LogMongoRepository()

    return new LogControllerDecorator(this.controller, logMongoRepository)
  }
}
