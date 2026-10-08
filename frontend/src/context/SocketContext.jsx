import { createContext, useContext, useRef, useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

let socketInstance = null

function getSocket() {
  if (!socketInstance) {
    socketInstance = io('https://quiz-game-szr2.onrender.com', {
      transports: ['websocket'],
      autoConnect: true,
    })
  }
  return socketInstance
}

export function SocketProvider({ children }) {
  const socket = getSocket()

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
