import { DbAddAccount } from './db-add-account'
import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }

      return await Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountRepositoryStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const addAccountRepository = makeAddAccountRepositoryStub()
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepository)

  return {
    sut: sut,
    encrypterStub: encrypterStub,
    addAccountRepositoryStub: addAccountRepository
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.add({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })

    expect(addRepositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
