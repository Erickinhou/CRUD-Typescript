import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator } from '../../protocols'
import { SignUpController } from './signup'

// factories
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password'
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

// interface
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

// factory
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()

  const addAccountStub = makeAddAccount()

  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  //
  // REQUIRED NAME
  //
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        // name: 'user#1',
        email: 'user1@email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  //
  // REQUIRED EMAIL
  //
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'user#1',
        // email: 'user1@email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  //
  // REQUIRED PASSWORD
  //
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'user1@email.com',
        // password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  //
  // REQUIRED PASSWORD CONFIRM
  //
  test('Should return 400 if no passwordConfirm is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'user1@email.com',
        password: '1234'
        // passwordConfirm: '1234'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })

  //
  // FAILED PASSWORD CONFIRMATION
  //
  test('Should return 400 if passwordConfirm fails', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'user1@email.com',
        password: '1234',
        passwordConfirm: '123456'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'))
  })

  //
  // INVALID EMAIL
  //
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    // valor mockado alterado para false
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'invalid_user1-email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  //
  // CORRECT EMAIL
  //
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidspy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'any-email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    sut.handle(httpRequest)

    expect(isValidspy).toHaveBeenCalledWith('any-email.com')
  })

  //
  // THROWS EXCEPTION
  //
  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    // implementação mockada para retornar throw error
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'any-email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)

    expect(httpResponse.body).toEqual(new ServerError())
  })

  //
  // ADD ACCOUNT
  //
  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'any-email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'user#1',
      email: 'any-email.com',
      password: '1234'
    })
  })
})
