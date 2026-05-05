import { createContext, useState, useContext, useEffect } from 'react'

// Contexto global para manejar la autenticación
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [empresa, setEmpresa] = useState(
    JSON.parse(localStorage.getItem('empresa')) || null
  )

  // Guardar token y datos de empresa al hacer login
  const login = (accessToken, datosEmpresa) => {
    localStorage.setItem('token', accessToken)
    localStorage.setItem('empresa', JSON.stringify(datosEmpresa))
    setToken(accessToken)
    setEmpresa(datosEmpresa)
  }

  // Limpiar todo al cerrar sesión
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('empresa')
    setToken(null)
    setEmpresa(null)
  }

  return (
    <AuthContext.Provider value={{ token, empresa, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  return useContext(AuthContext)
}