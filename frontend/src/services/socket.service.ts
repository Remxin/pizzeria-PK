import { io, type Socket } from 'socket.io-client'
import { getAccessToken } from '../utils/authStorage'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(`${SOCKET_URL}/orders`, {
      autoConnect: false,
      auth: (callback) => {
        callback({ token: getAccessToken() })
      },
    })
  }

  return socket
}

export function connectSocket(): void {
  const instance = getSocket()

  if (!instance.connected) {
    instance.auth = { token: getAccessToken() }
    instance.connect()
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export function joinOrderRoom(orderId: number): void {
  const instance = getSocket()

  if (instance.connected) {
    instance.emit('order:join', { orderId })
  }
}

export function leaveOrderRoom(orderId: number): void {
  const instance = getSocket()

  if (instance.connected) {
    instance.emit('order:leave', { orderId })
  }
}
