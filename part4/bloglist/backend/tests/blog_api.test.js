const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const { blogs } = require('./fixtures/blogs')
const helper = require('../utils/test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const rootUser = new User({ username: 'root', passwordHash })
  await rootUser.save()
})

describe('Blogs API', () => {
  describe('GET /api/blogs', () => {
    test('returns all blogs', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, blogs.length)
    })
    test('returns blogs as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  })
  describe('POST /api/blogs', () => {
    test('creates a new post if logged in', async () => {
      const token = await helper.login(api)

      const newBlog = {
        title: 'Hyvä puhelinluetteloapplikaatio',
        author: 'Meikä Mandariini',
        url: 'https://fso.miljoonas.fi',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogs.length + 1)
      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('Hyvä puhelinluetteloapplikaatio'))
    })
    test('fails to creates a new post without logging in', async () => {
      const newBlog = {
        title: 'Hyvä puhelinluetteloapplikaatio',
        author: 'Meikä Mandariini',
        url: 'https://fso.miljoonas.fi',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogs.length)
    })
    for (const field of ['title', 'url']) {
      test(`fails with missing ${field}`, async () => {
        const token = await helper.login(api)
        const newBlog = {
          title: 'Hyvä puhelinluetteloapplikaatio',
          author: 'Meikä Mandariini',
          url: 'https://fso.miljoonas.fi',
          likes: 8
        }

        delete newBlog[field]

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogs.length)
      })
    }
    test('defaults to 0 with missing likes', async () => {
      const token = await helper.login(api)
      const newBlog = {
        title: 'Hyvä puhelinluetteloapplikaatio',
        author: 'Meikä Mandariini',
        url: 'https://fso.miljoonas.fi',
      }
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.likes, 0)
    })
  })
  describe('GET /api/blogs/:id', () => {
    test('returns a blog by id', async () => {
      const blogs = await helper.blogsInDb()
      await api
        .get(`/api/blogs/${blogs[0].id}`)
        .expect(200)
    })
    test('returns 404 if a blog does not exist', async () => {
      await api
        .get(`/api/blogs/${helper.nonExistingId}`)
        .expect(404)
    })
  })
  describe('PUT /api/blogs/:id', () => {
    test('updates a blog likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes + 1)
    })
  })
  describe('DELETE /api/blogs/:id', () => {
    test('deletes a blog created by the logged-in user', async () => {
      const token = await helper.login(api)

      const newBlog = {
        title: 'Blog to delete',
        author: 'Matti Luukkainen',
        url: 'https://example.com',
        likes: 5,
      }

      const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(createdBlog.body.id))
    })
    test('fails deleting a blog not created by the logged-in user', async () => {
      const token = await helper.login(api)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)

      const blogsAtEnd = await helper.blogsInDb()

      assert.deepStrictEqual(blogsAtStart, blogsAtEnd)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})