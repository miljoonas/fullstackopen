import { useNavigate } from 'react-router-dom'
import { Button, Card, CardActions, CardContent, Link, Stack, Typography } from '@mui/material'

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
    <Card className='blog'>
      <CardContent>
        <Typography>
          {blog.author}: {blog.title}
        </Typography>
        <article>
          <Link href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </Link>
          <Stack direction='row' spacing={1} alignItems='center' sx={{ mt: 2 }}>
            <Typography>likes {blog.likes}</Typography>
            {canLike && (
              <Button size='small' variant='outlined' onClick={() => likeBlog(blog)}>
                like
              </Button>
            )}
          </Stack>
          <Typography color='text.secondary' sx={{ mt: 2 }} >
            Added by {blog.user?.name}
          </Typography>
        </article>
      </CardContent>
      {canRemove && (
        <CardActions>
          <Button size='small' color='error' variant='outlined' onClick={handleDelete}>
            remove
          </Button>
        </CardActions>
      )}
    </Card >
  )
}

export default Blog