const SequelizeMock = require('sequelize-mock-v5')

export const MySqlHelper = {
  client: null as typeof SequelizeMock,

  async connect (): Promise<void> {
    // Make Fake DB Connection
    this.client = new SequelizeMock()
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getModel (model: string): any {
    return this.models()[model]
  },

  models (): any {
    return {
      users: this.client.define('users', {
        id: 'valid-uuid-v4',
        name: 'any-name',
        email: 'any-email',
        password: 'any-password'
      })
    }
  }

}
