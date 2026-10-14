import { useState, useCallback } from 'react'

const useMessage = (duration = 5000) => {
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const showMessage = useCallback((type, text) => {
    setMessageType(type)
    setMessage(text)

    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, duration)
  }, [duration])

  return {
    message,
    messageType,
    showMessage,
  }
}

export { useMessage }