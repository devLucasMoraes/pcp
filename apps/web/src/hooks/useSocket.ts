import { useEffect } from 'react'

import { useSocketStore } from '../stores/socket-store'

export const useSocket = () => {
  const store = useSocketStore()
  const { connect, disconnect } = store

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return store
}
