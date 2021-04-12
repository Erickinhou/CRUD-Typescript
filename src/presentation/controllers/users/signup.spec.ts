import { MissingParamError } from '../../erros/missing-param-error'
import { SignUpController } from './signup'

// factory
const makeSut = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = makeSut()

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

  test('Should return 400 if no email is provided', () => {
    const sut = makeSut()

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

  test('Should return 400 if no password is provided', () => {
    const sut = makeSut()

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

  test('Should return 400 if no passwordConfirm is provided', () => {
    const sut = makeSut()

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
})
