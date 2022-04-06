import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app).post('/api/signup').send({
      name: 'joao',
      email: 'joao@joao.com',
      password: '123',
      passwordConfirmation: '123'
    }).expect(200)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
})