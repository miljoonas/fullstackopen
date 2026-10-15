import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setTitle] = useState('')
  const [blogAuthor, setAuthor] = useState('')
  const [blogUrl, setUrl] = useState('')
  const navigate = useNavigate()

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      await createBlog({
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl
      })

      setTitle('')
      setAuthor('')
      setUrl('')
      navigate('/')
    } catch {
      // error handled
    }
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={blogTitle}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            author:
            <input
              type="text"
              value={blogAuthor}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            url:
            <input
              type="text"
              value={blogUrl}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm