import { MongoHelper } from '../helpers/mongo_helper'

import { AccountMongoRepository } from '../account-repository/account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  test('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@main.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@main.com')
    expect(account.password).toBe('any_password')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
})