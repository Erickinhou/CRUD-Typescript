import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MySqlHelper } from '../helpers/mysql-helper'

export class AccountMySqlRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    // it must return an account
    const account = MySqlHelper.getModel('users').create(accountData)

    return account
    // return await new Promise(resolve => resolve(null))
  }
}
