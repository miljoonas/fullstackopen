import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert
      className={type === 'error' ? 'error' : 'info'}
      severity={type === 'error' ? 'error' : 'success'}
      sx={{ mt: 2, mb: 2 }}
    >
      {message}
    </Alert >
  )
}

export default Notification