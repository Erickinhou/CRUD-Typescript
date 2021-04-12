import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()

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

    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
})


describe('SignUp Controller', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController()

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

    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
