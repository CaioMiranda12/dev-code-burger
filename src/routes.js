import { Router } from 'express'

import User from './app/models/User'

import { v4 } from 'uuid'

const routes = new Router()

routes.get('/', async (request, response) => {
  const user = await User.create({
    id: v4(),
    name: 'Caio',
    email: 'caioclm02@gmail.com',
    password_hash: 'h2s4e32d',
    admin: true,
  })
  return response.json(user)
})

export default routes
