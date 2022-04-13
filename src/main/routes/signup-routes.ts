import { Router } from 'express'
import { expressAdapter } from '../adapters/express-route-adapter'
import { SignUpFactory } from '../factories/signup/signup'

export default (router: Router): void => {
  router.post('/signup', expressAdapter(new SignUpFactory().factory()))
}
