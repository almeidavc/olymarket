import { io, Socket } from 'socket.io-client'
import { useRef, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import Constants from 'expo-constants'

const url = Constants.expoConfig?.extra?.API_URL
if (!url) {
  throw new Error('Server url is not set, please configure it manually')
}

export const useAuthSocket = (): Socket => {
  const { getToken } = useAuth()

  const { current: socket } = useRef(
    io(url, {
      autoConnect: false,
    }),
  )

  useEffect(() => {
    socket.connect()
    socket.on('connect', async () => {
      const token = await getToken()
      socket.emit('authenticate', { token })
      socket.on('unauthorized', () => {
        throw new Error('Not authorized')
      })
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  return socket
}
