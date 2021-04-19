import request from 'supertest'

import app from '../config/app'

describe('SignUp Routes', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any-name',
        email: 'any-email',
        password: '1234',
        passwordConfirm: '1234'
      })
      .expect(200)
  })
})
