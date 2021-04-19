import request from 'supertest'

import app from '../config/app'

describe('Content Type Middleware', () => {
  // JSON
  test('should return default content type as JSON', async () => {
    app.get('/test-content-type', (req, res) => {
      res.json('')
    })
    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  // XML
  test('should return XML content type when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
        .send('')
    })
    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
