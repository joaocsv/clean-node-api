import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo_helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(addAccountModel)
    const account = await accountCollection.findOne(result.insertedId)
    const { _id, ...accountWithoutId } = account

    return Object.assign({}, accountWithoutId, { id: _id.toHexString() }) as AccountModel
  }
}
