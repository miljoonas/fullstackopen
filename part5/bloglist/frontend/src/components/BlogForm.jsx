import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'

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
    <Box>
      <Typography variant='h5' component='h2' gutterBottom>
        Create new
      </Typography>
      <Box
        component='form'
        onSubmit={addBlog}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          id='title'
          label='title'
          value={blogTitle}
          onChange={({ target }) => setTitle(target.value)}
        />

        <TextField
          id='author'
          label='author'
          value={blogAuthor}
          onChange={({ target }) => setAuthor(target.value)}
        />

        <TextField
          id='url'
          label='url'
          value={blogUrl}
          onChange={({ target }) => setUrl(target.value)}
        />

        <Button type="submit" variant='contained'>create</Button>
      </Box>
    </Box>
  )
}

export default BlogForm