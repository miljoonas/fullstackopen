const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require('../models/user')
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const rootUser = new User({ username: 'root', passwordHash })
  await rootUser.save()
})

describe('Users API', () => {
  describe('POST /api/users', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails if username is already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert(result.body.error.includes('expected `username` to be unique'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    for (const field of ['username', 'password']) {
      test(`creation fails if ${field} is missing`, async () => {
        const newUser = {
          username: 'mluukkai',
          name: 'Matti Luukkainen',
          password: 'salainen',
        }

        delete newUser[field]

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, 1)
      })
    }

    test('creation fails if username is shorter than 3 characters', async () => {
      const newUser = {
        username: 'ab',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, 1)
    })

    test('creation fails if password is shorter than 3 characters', async () => {
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'ab',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})