import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { Factory } from '../../factory'
import { DbAddAccountFactory } from '../../usecases/add-account/db-add-account-factory'
import { DbAuthenticationFactory } from '../../usecases/authentication/db-authentication-factory'
import { SignUpValidatorFactory } from './signup-validator-factory'

export class SignUpControllerFactory implements Factory <Controller> {
  factory (): Controller {
    const dbAddAccountFactory = new DbAddAccountFactory()
    const signUpValidatorFactory = new SignUpValidatorFactory()
    const dbAuthenticationFactory = new DbAuthenticationFactory()
    const signUpController = new SignUpController(dbAddAccountFactory.factory(), signUpValidatorFactory.factory(), dbAuthenticationFactory.factory())
    const logControllerDecoratorFactory = new LogControllerDecoratorFactory(signUpController)

    return logControllerDecoratorFactory.factory()
  }
}
