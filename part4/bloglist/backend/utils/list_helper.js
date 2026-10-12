const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (!blogs.length) return null
  return blogs.reduce((best, blog) => best.likes > blog.likes ? best : blog)
}

const mostBlogs = (blogs) => {
  if (!blogs.length) return null

  // { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }
  const authors = blogs.reduce((result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + 1
    return result
  }, {})

  // [ 'Robert C. Martin', 3 ]
  return Object.entries(authors).reduce((best, current) => best[1] > current [1] ? best : current)
}

const mostLikes = (blogs) => {
  if (!blogs.length) return null

  // { 'Michael Chan': 7, 'Edsger W. Dijkstra': 17, 'Robert C. Martin': 12 }
  const authorLikes = blogs.reduce((result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + blog.likes
    return result
  }, {})

  // [ 'Edsger W. Dijkstra', 17 ]
  return Object.entries(authorLikes).reduce((best, current) => best[1] > current [1] ? best : current)
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}