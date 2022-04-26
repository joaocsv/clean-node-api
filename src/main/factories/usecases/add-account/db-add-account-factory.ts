import { Factory } from '../../factory'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'

export class DbAddAccountFactory implements Factory <AddAccount> {
  factory (): AddAccount {
    const salt = 12
    const hasher = new BcryptAdapter(salt)
    const accountRepository = new AccountMongoRepository()
    return new DbAddAccount(hasher, accountRepository, accountRepository)
  }
}
