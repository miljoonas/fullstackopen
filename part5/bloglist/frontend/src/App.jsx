import { useState, useEffect } from 'react'
import { Link, Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import { useMessage } from './hooks/useMessage'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Footer from './components/Footer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const { message, messageType, showMessage } = useMessage()
  const [user, setUser] = useState(() => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
    } catch {
      return null
    }
  })
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
      .catch(error => {
        console.error('Failed to fetch blogs:', error)
      })
  }, [])

  useEffect(() => {
    blogService.setToken(user?.token ?? null)
  }, [user])

  const handleLogin = async ({ username, password }) => {
    try {
      const loggedInUser = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedInUser)
      )
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      navigate('/')
    } catch (error) {
      showMessage('error', 'Wrong username or password')
      console.log(error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }


  const createBlog = (blogObject) => {
    return blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(prevBlogs => prevBlogs.concat(returnedBlog))
        showMessage('info', `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      })
      .catch(error => {
        showMessage('error', error.response?.data?.error || 'Failed to create blog')
        throw error
      })
  }

  const likeBlog = async (blogToLike) => {
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1
    }

    try {
      const returnedBlog = await blogService.update(
        blogToLike.id,
        updatedBlog
      )

      setBlogs(prevBlogs =>
        prevBlogs.map(b =>
          b.id === returnedBlog.id
            ? { ...returnedBlog, user: returnedBlog.user ?? blogToLike.user }
            : b
        )
      )
    } catch (error) {
      showMessage(
        'error',
        error.response?.data?.error || 'Failed to like blog'
      )
    }
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)
    if (!blogToDelete) return
    try {
      await blogService.remove(id)
      setBlogs(currentBlogs => currentBlogs.filter(b => b.id !== id))
      showMessage('info', `Deleted ${blogToDelete.title}`)
    } catch (error) {
      showMessage('error', `Failed to deleted ${blogToDelete.title}`)
      throw error
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <Footer/>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user ? (
          <>
            <Link style={padding} to="/create">new blog</Link>
            <button onClick={handleLogout}>logout</button>

          </>
        ) : (
          <Link style={padding} to="/login">login</Link>
        )}
      </div>
      {user && `Logged in as ${user.name}`}
      <Notification message={message} type={messageType} />
      <Routes>
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            user={user}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
          />
        } />
        <Route path="/create" element={
          user ? <BlogForm createBlog={createBlog} /> : <Navigate replace to="/login" />
        } />
        <Route path="/login" element={<LoginForm login={handleLogin} />} />
        <Route path="/" element={<BlogList blogs={blogs} />} />
      </Routes>

    </div>


  )
}

export default App