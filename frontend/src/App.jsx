import { RouterProvider } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import router from './routes/router'

export default function App() {
  return (
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  )
}
