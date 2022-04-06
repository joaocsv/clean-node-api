import { Router } from 'express'
import { expressAdapter } from '../adapters/express-route-adapter'
import { signUpFactory } from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', expressAdapter(signUpFactory()))
}
