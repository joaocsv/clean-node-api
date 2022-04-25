import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  ) {}

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepositoryStub.loadByEmail(addAccountModel.email)

    const passwordHashed = await this.hasher.hash(addAccountModel.password)

    const account = await this.addAccountRepository.add(Object.assign({}, addAccountModel, { password: passwordHashed }))

    return await new Promise(resolve => resolve(account))
  }
}
