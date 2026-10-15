import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const canLike = !!user
  const canRemove = !!user && blog.user?.username === user.username

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${blog.title}"?`)) {
      return
    }

    try {
      await deleteBlog(blog.id)
      navigate('/')
    } catch {
      // error handled
    }
  }

  return (
    <div className='blog'>
      <h2>
        {blog.author}: {blog.title}
      </h2>
      <article>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
        <div>
          likes {blog.likes}
          {canLike && (
            <button onClick={() => likeBlog(blog)}>
              like
            </button>
          )}
        </div>
        <div>Added by {blog.user?.name}</div>
      </article>
      {canRemove && (
        <button onClick={handleDelete}>
          remove
        </button>
      )}
    </div>
  )
}

export default Blog