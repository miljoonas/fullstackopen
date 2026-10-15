import { Link } from 'react-router-dom'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>Blogs</h2>
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (

          <div key={blog.id} className='blog' style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} - {blog.author}
            </Link>
          </div>
        ))}
    </div >
  )
}

export default BlogList