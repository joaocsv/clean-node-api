import { DbAuthentication } from './db-authentication'
import { AccountModel, AuthenticationModel, LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository } from './db-authentication-protocols'

const makeFakeAccountModel = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_mail',
    password: 'hashed_password'
  }
}

const makeFakeAuthenticationModel = (): AuthenticationModel => {
  return {
    email: 'any_mail@email.com',
    password: 'any_password'
  }
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return makeFakeAccountModel()
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparer implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparer()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return 'any_token'
    }
  }

  return new EncrypterStub()
}

const makeUpdateAcccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAcccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {

    }
  }

  return new UpdateAcccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const updateAccessTokenRepositoryStub = makeUpdateAcccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth(makeFakeAuthenticationModel())

    expect(loadSpy).toHaveBeenCalledWith('any_mail@email.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))

    const promiseAuth = sut.auth(makeFakeAuthenticationModel())

    await expect(promiseAuth).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

    const resultAuth = await sut.auth(makeFakeAuthenticationModel())

    await expect(resultAuth).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(makeFakeAuthenticationModel())

    await expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))

    const promiseAuth = sut.auth(makeFakeAuthenticationModel())

    await expect(promiseAuth).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const resultAuth = await sut.auth(makeFakeAuthenticationModel())

    await expect(resultAuth).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()

    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthenticationModel())

    await expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const promiseAuth = sut.auth(makeFakeAuthenticationModel())

    await expect(promiseAuth).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut } = makeSut()

    const resultAuth = await sut.auth(makeFakeAuthenticationModel())

    expect(resultAuth).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeFakeAuthenticationModel())

    expect(updateSpy).toBeCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })
})
