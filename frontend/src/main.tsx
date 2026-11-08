import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'

const raiz = document.getElementById('root')
if (!raiz) {
  throw new Error('No se encontró el elemento #root en index.html.')
}

createRoot(raiz).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
