import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Pastikan ini satu-satunya file CSS yang diimpor
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)