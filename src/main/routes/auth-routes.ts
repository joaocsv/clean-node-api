import { Router } from 'express'
import { expressAdapter } from '../adapters/express/express-route-adapter'
import { LoginControllerFactory } from '../factories/controllers/login/login-controller-factory'
import { SignUpControllerFactory } from '../factories/controllers/signup/signup-factory'

export default (router: Router): void => {
  router.post('/signup', expressAdapter(new SignUpControllerFactory().factory()))
  router.post('/login', expressAdapter(new LoginControllerFactory().factory()))
}
