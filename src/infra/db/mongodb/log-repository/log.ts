import { AddLogErrorRepository } from '../../../../data/protocols/db/add-log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements AddLogErrorRepository {
  async addError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
