import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { Factory } from '../../factory'
import { DbAuthenticationFactory } from '../../usecases/authentication/db-authentication-factory'
import { LoginValidatorFactory } from './login-validator-factory'

export class LoginControllerFactory implements Factory<Controller> {
  factory (): Controller {
    const loginValidatorFactory = new LoginValidatorFactory()
    const dbAuthenticationFactory = new DbAuthenticationFactory()
    const loginController = new LoginController(loginValidatorFactory.factory(), dbAuthenticationFactory.factory())
    const logControllerDecoratorFactory = new LogControllerDecoratorFactory(loginController)

    return logControllerDecoratorFactory.factory()
  }
}
