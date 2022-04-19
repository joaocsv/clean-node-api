import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Auth Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app).post('/api/signup').send({
        name: 'joao',
        email: 'joao@joao.com',
        password: '123',
        passwordConfirmation: '123'
      }).expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)

      await accountCollection.insertOne({
        name: 'joao',
        email: 'joao@joao.com',
        password: password
      })

      await request(app).post('/api/login').send({
        email: 'joao@joao.com',
        password: '123'
      }).expect(200)
    })
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
})
