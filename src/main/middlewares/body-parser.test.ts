import request from 'supertest'

import app from '../config/app'

describe('Body Parsers Middleware', () => {
  const requestBody = { name: 'Body Parser Tester' }

  test('should parse body as express json bodyparse', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test-body-parser')
      .send(requestBody)
      .expect(requestBody)
  })
})
