import { env } from '@pcp/env-client'
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

interface SocketState {
  socket: Socket | null
  isConnected: boolean
  lastError: string | null
  connect: () => Promise<void>
  disconnect: () => void
  emit: (event: string, data: unknown) => void
  subscribe: (event: string, callback: (data: unknown) => void) => () => void
  setError: (error: string | null) => void
}

const SOCKET_URL = env.VITE_SOCKET_URL

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  lastError: null,

  connect: async () => {
    const { socket } = get()
    if (socket?.connected) return

    // Clean up existing socket if any
    if (socket) {
      socket.close()
    }

    try {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
      })

      // Set up event handlers
      newSocket.on('connect', () => {
        set({ isConnected: true, lastError: null })
        console.log('Socket connected')
      })

      newSocket.on('disconnect', () => {
        set({ isConnected: false })
        console.log('Socket disconnected')
      })

      newSocket.on('connect_error', (error) => {
        set({
          isConnected: false,
          lastError: error.message,
        })
        console.error('Socket connection error:', error)
      })

      // Store the socket instance
      set({ socket: newSocket })
    } catch (error) {
      console.error('Socket connection error:', error)
      set({
        lastError:
          error instanceof Error ? error.message : 'Socket connection failed',
      })
    }
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.close()
      set({
        socket: null,
        isConnected: false,
        lastError: null,
      })
    }
  },

  emit: (event: string, data: unknown) => {
    const { socket, isConnected } = get()
    if (socket && isConnected) {
      socket.emit(event, data)
    } else {
      console.warn('Cannot emit event: socket not connected')
    }
  },

  subscribe: (event: string, callback: (data: unknown) => void) => {
    const { socket } = get()
    if (!socket) {
      console.warn('Cannot subscribe: socket not initialized')
      return () => {}
    }

    const handler = (data: unknown) => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error handling socket event ${event}:`, error)
      }
    }

    socket.on(event, handler)
    return () => {
      socket.off(event, handler)
    }
  },

  setError: (error: string | null) => {
    set({ lastError: error })
  },
}))
