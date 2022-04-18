import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise((resolve) => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return await new Promise((resolve) => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct value', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()

    const resultHash = await sut.hash('any_value')

    await expect(resultHash).toBe('hash')
  })

  test('Should throw if bcrypt throw', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.hash('any_value')

    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()

    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'hash_value')

    expect(compareSpy).toBeCalledWith('any_value', 'hash_value')
  })

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut()

    const resultCompare = await sut.compare('any_value', 'hash_value')

    expect(resultCompare).toBe(true)
  })

  test('Should return false when compare fails', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)

    const resultCompare = await sut.compare('any_value', 'hash_value')

    expect(resultCompare).toBe(false)
  })
})
