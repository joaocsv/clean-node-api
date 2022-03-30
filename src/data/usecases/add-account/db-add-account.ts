import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.encrypter.encrypt(addAccountModel.password)

    this.addAccountRepository.add(Object.assign({}, addAccountModel, { password: passwordHashed }))

    return await new Promise(resolve => resolve(null))
  }
}
