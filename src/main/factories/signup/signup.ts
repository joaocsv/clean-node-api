import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { Factory } from '../factory'
import { SignUpValidatorFactory } from './signup-validator'

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
