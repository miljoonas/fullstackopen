const Blog = require('../models/blog')
const User = require('../models/user')

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'dummy',
    url: 'https://slowroads.io'
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const login = async (api, username = 'root', password = 'sekret') => {
  const response = await api
    .post('/api/login')
    .send({ username, password })

  return response.body.token
}

module.exports = {
  nonExistingId,
  blogsInDb,
  usersInDb,
  login
}