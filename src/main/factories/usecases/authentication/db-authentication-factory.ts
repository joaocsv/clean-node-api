import env from '../../../config/env'

import { Authentication } from '../../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { Factory } from '../../factory'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'

export class DbAuthenticationFactory implements Factory<Authentication> {
  factory (): Authentication {
    const loadAccountByEmailRepository = new AccountMongoRepository()
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()

    return new DbAuthentication(loadAccountByEmailRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  }
}
