import Togglable from './Togglable'

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog" style={blogStyle}>
      <Togglable variant="titled" title={`${blog.title} - ${blog.author}`} buttonLabel="view">
        <article>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => likeBlog(blog)}>
              like
            </button>
          </div>
          <div>{blog.user?.name}</div>
        </article>
        <button onClick={() => deleteBlog(blog.id) }>
          remove
        </button>
      </Togglable>
    </div>
  )
}

export default Blog