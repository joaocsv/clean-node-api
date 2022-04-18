import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.hasher.hash(addAccountModel.password)

    const account = await this.addAccountRepository.add(Object.assign({}, addAccountModel, { password: passwordHashed }))

    return await new Promise(resolve => resolve(account))
  }
}
