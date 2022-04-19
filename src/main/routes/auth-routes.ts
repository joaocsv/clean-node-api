import { Router } from 'express'
import { expressAdapter } from '../adapters/express/express-route-adapter'
import { LoginFactory } from '../factories/login/login-factory'
import { SignUpFactory } from '../factories/signup/signup-factory'

export default (router: Router): void => {
  router.post('/signup', expressAdapter(new SignUpFactory().factory()))
  router.post('/login', expressAdapter(new LoginFactory().factory()))
}
