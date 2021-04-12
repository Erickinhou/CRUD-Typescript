import { InvalidParamError, MissingParamError } from '../../../errors'
import { badRequest, serverError } from '../../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse | any {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirm } = httpRequest.body

      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })
    } catch (error) {
      console.trace(error)
      return serverError()
    }
  }
}
