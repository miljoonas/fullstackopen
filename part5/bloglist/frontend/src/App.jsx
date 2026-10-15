import { useState, useEffect, useRef } from 'react'
import { useMessage } from './hooks/useMessage'
import axios from 'axios'
import blogService from './services/blogs'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'


const baseUrl = '/api/blogs'
const loginUrl = '/api/login'

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
  const blogFormRef = useRef()

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setBlogs(response.data)
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
      const response = await axios.post(loginUrl, {
        username,
        password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(response.data)
      )
      blogService.setToken(response.data.token)
      setUser(response.data)
    } catch (error) {
      showMessage('error', 'Wrong username or password')
      console.log(error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }


  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(prevBlogs => prevBlogs.concat(returnedBlog))
        showMessage('info', `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        )
      })
      .catch(error => {
        showMessage('error', error.response?.data?.error || 'Failed to create blog')
      })
  }

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    try {
      const returnedBlog = await blogService.update(
        blog.id,
        updatedBlog
      )

      setBlogs(prevBlogs =>
        prevBlogs.map(b =>
          b.id === returnedBlog.id ? returnedBlog : b
        )
      )
    } catch (error) {
      showMessage(
        'error',
        error.response?.data?.error || 'Failed to like blog'
      )
    }
  }

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      {blogs
        .slice()
        .sort((a,b) => b.likes - a.likes)
        .map(blog => (
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user} />
        ))}
    </div>
  )


  const deleteBlog = id => {
    console.log('delete gets called')
    const blog = blogs.find(blog => blog.id === id)
    console.log('here?', blog)
    if (!blog) return
    if (window.confirm(`Delete "${blog.title}"?`)) {
      blogService
        .remove(id)
        .then(() => {

          setBlogs(currentBlogs =>
            currentBlogs.filter(blog => blog.id !== id)
          )
          showMessage('info', `Deleted "${blog.title}"`)
        })
        .catch(() => {
          showMessage('error', `Failed to delete "${blog.title}".`)
        })
    }
  }

  return (
    <div>
      <h1>Blog app</h1>

      <Notification message={message} type={messageType}/>
      {user === null ? (
        <div>
          <Togglable buttonLabel='login'>
            <LoginForm login={handleLogin}/>
          </Togglable>
        </div>
      ) : (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          {blogList()}
        </div>
      )}
    </div>
  )
}

export default App