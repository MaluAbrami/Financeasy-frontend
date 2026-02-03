import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
