import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'
import { EmailValidator } from '../presentation/protocols/email-validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

// factory method
const makeSut = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('should return false if validator returns fale', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@email.com')

    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', () => {
    const sut = makeSut()

    const isValid = sut.isValid('valid_email@email.com')

    expect(isValid).toBe(true)
  })

  test('should call validator with correct email', () => {
    const sut = makeSut()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@email.com')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
