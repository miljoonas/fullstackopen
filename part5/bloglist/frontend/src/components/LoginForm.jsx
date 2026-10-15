import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <Box sx={{ mt: 2, maxWidth: 400 }}>
      <Typography variant='h5' component='h2' gutterBottom>
        Login
      </Typography>

      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          id='username'
          label='username'
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <TextField
          id='password'
          label='password'
          type='password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Button type='submit' variant='contained'>
          login
        </Button>
      </Box>
    </Box >
  )
}

export default LoginForm