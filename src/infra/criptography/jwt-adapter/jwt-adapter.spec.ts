import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  }
}))

describe('JwtAdapter', () => {
  test('Should calls sign with correct values', async () => {
    const sut = new JwtAdapter('secret')

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should returns a token on sign success', async () => {
    const sut = new JwtAdapter('secret')

    const resultEncrypt = await sut.encrypt('any_id')

    expect(resultEncrypt).toBe('any_token')
  })

  test('Should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret')

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const promiseEncrypt = sut.encrypt('any_id')

    await expect(promiseEncrypt).rejects.toThrow()
  })
})
