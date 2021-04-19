import { AddAccount, AccountModel, AddAccountModel, EmailValidator } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../../errors'
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
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password'
      }

      return await new Promise(resolve => resolve(fakeAccount))
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
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        // name: 'user#1',
        email: 'user1@email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  //
  // REQUIRED EMAIL
  //
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'user#1',
        // email: 'user1@email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  //
  // REQUIRED PASSWORD
  //
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'user1@email.com',
        // password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  //
  // REQUIRED PASSWORD CONFIRM
  //
  test('Should return 400 if no passwordConfirm is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'user1@email.com',
        password: '1234'
        // passwordConfirm: '1234'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })

  //
  // FAILED PASSWORD CONFIRMATION
  //
  test('Should return 400 if passwordConfirm fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'user1@email.com',
        password: '1234',
        passwordConfirm: '123456'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'))
  })

  //
  // INVALID EMAIL
  //
  test('Should return 400 if an invalid email is provided', async () => {
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

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  //
  // CORRECT EMAIL
  //
  test('Should call EmailValidator with correct email', async () => {
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

    await sut.handle(httpRequest)

    expect(isValidspy).toHaveBeenCalledWith('any-email.com')
  })

  //
  // EMAIL THROWS EXCEPTION
  //
  test('Should return 500 if EmailValidator throws', async () => {
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

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)

    expect(httpResponse.body).toEqual(new ServerError())
  })

  //
  // ADD ACCOUNT
  //
  test('Should call AddAccount with correct values', async () => {
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

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'user#1',
      email: 'any-email.com',
      password: '1234'
    })
  })

  //
  // ADD ACCOUNT THROWS EXCEPTION
  //
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    // implementação mockada para retornar throw error
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = {
      body: {
        name: 'user#1',
        email: 'any-email.com',
        password: '1234',
        passwordConfirm: '1234'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)

    expect(httpResponse.body).toEqual(new ServerError())
  })

  //
  // SUCCESS CASE
  //
  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_user#1',
        email: 'valid_user1-email.com',
        password: 'valid_1234',
        passwordConfirm: 'valid_1234'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)

    expect(httpResponse.body).toEqual({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    })
  })
})
