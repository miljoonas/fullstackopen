import { Link as RouterLink } from 'react-router-dom'
import { Link, Paper, Stack, Typography } from '@mui/material'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <Typography variant='h5' component='h2' sx={{ mt: 2, mb: 2 }}>
        Blogs
      </Typography>
      <Stack spacing={1}>

        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (

            <Paper key={blog.id} className='blog' variant='outlined' sx={{ p: 1.5 }}>
              <Link
                component={RouterLink}
                to={`/blogs/${blog.id}`}
                underline='hover'
              >
                {blog.title} - {blog.author}
              </Link>
            </Paper>
          ))}
      </Stack>
    </div >
  )
}

export default BlogList