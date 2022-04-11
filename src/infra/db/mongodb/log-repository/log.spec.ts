import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'
import { Collection } from 'mongodb'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.addError('any_error')

    const errosCount = await errorCollection.countDocuments()
    expect(errosCount).toBe(1)
  })
})
