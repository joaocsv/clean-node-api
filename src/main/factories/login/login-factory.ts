import env from '../../config/env'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Factory } from '../factory'
import { LoginValidatorFactory } from './login-validator-factory'

export class LoginFactory implements Factory<Controller> {
  factory (): Controller {
    const loadAccountByEmailRepository = new AccountMongoRepository()
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    const authentication = new DbAuthentication(loadAccountByEmailRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)

    const validators = new LoginValidatorFactory()
    const loginController = new LoginController(validators.factory(), authentication)

    const addLogErrorRepository = new LogMongoRepository()
    const logControllerDecorator = new LogControllerDecorator(loginController, addLogErrorRepository)

    return logControllerDecorator
  }
}
