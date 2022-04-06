import { MongoHelper } from '../helpers/mongo-helper'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  test('Should reconnect if mongodb is down', async () => {
    let collection = await MongoHelper.getCollection('accounts')
    expect(collection).toBeTruthy()

    await MongoHelper.disconnect()

    collection = await MongoHelper.getCollection('accounts')
    expect(collection).toBeTruthy()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
})
