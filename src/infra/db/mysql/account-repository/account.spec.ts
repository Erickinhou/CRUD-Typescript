
import { AccountMySqlRepository } from './account'
import { MySqlHelper } from '../helpers/mysql-helper'

describe('Account Mysql Repository', () => {
  beforeAll(async () => {
    await MySqlHelper.connect()
  })

  afterAll(async () => {
    await MySqlHelper.disconnect()
  })

  const makeSut = (): AccountMySqlRepository => {
    return new AccountMySqlRepository()
  }

  test('Should return an account on success ', async () => {
    const sut = makeSut()

    const requestBody = {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password'
    }

    const account = await sut.add(requestBody)

    // expect(account).toEqual(requestBody)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any-name')
    expect(account.email).toBe('any-email')
    expect(account.password).toBe('any-password')
  })
})
