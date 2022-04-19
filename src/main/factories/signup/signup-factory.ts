import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Factory } from '../factory'
import { SignUpValidatorFactory } from './signup-validator-factory'

export class SignUpFactory implements Factory <Controller> {
  factory (): Controller {
    const salt = 12
    const hasher = new BcryptAdapter(salt)
    const accountRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(hasher, accountRepository)
    const validator = new SignUpValidatorFactory().factory()
    const signUpController = new SignUpController(dbAddAccount, validator)
    const logMongoRepository = new LogMongoRepository()

    return new LogControllerDecorator(signUpController, logMongoRepository)
  }
}