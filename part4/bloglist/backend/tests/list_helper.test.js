const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { emptyBlogs, listWithOneBlog, blogs } = require('./fixtures/blogs')

test('dummy returns one', () => {
  const result = listHelper.dummy(emptyBlogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyBlogs)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favourite blog', () => {

  test('of empty list is null', () => {
    const result = listHelper.favouriteBlog(emptyBlogs)
    assert.strictEqual(result, null)
  })

  test('of a bigger list is correct', () => {
    const result = listHelper.favouriteBlog(blogs)
    assert.deepEqual(result, blogs[2])
  })
})

describe('author with most blogs', () => {
  test('with empty list returns no authors', () => {
    assert.strictEqual(listHelper.mostBlogs(emptyBlogs), null)
  })

  test('is correct with only one entry', () => {
    assert.deepEqual(listHelper.mostBlogs(listWithOneBlog), [ 'Edsger W. Dijkstra', 1 ])
  })

  test('is correct with many entries', () => {
    assert.deepEqual(listHelper.mostBlogs(blogs), [ 'Robert C. Martin', 3 ])
  })
})

describe('author with most likes', () => {
  test('is correct', () => {
    assert.deepEqual(listHelper.mostLikes(blogs), [ 'Edsger W. Dijkstra', 17 ])
  })
})