// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react'
import authService, { apiClient } from '../services/api' // Tes appels API auth (login, logout, etc.)
// Utilisation de apiClient pour les requêtes authentifiées

// Crée le contexte
export const AuthContext = createContext() // ← ICI : on ajoute "export" !

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider')
  }
  return context
}

// Provider qui enveloppe toute l'app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const fetchCurrentUser = async () => {
    try {
      // L'URL correcte selon les routes définies dans api.php
      const response = await apiClient.get('/user')
      setCurrentUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Erreur fetch CurrentUser :', error)
    } finally {
      setLoading(false)
    }
  }

  // Au chargement, on vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    fetchCurrentUser()
  }, [])

  console.log(currentUser)

  // Fonction login
  const login = async credentials => {
    try {
      const response = await authService.login(credentials)
      const user = response.utilisateur
      const token = response.token

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      setCurrentUser(user)
      setIsAuthenticated(true)

      // Redirection en fonction du rôle
      switch (user.role) {
        case 'administrateur':
          window.location.href = '/admin/dashboard'
          break
        case 'vendeur':
          window.location.href = '/vendeur/dashboard'
          break
        case 'acheteur':
          window.location.href = '/acheteur/dashboard'
          break
        default:
          window.location.href = '/'
      }

      return response
    } catch (error) {
      throw error
    }
  }

  // Fonction d’inscription
  const register = async userData => {
    try {
      const response = await authService.register(userData)
      const user = response.utilisateur
      const token = response.token

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      setCurrentUser(user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      throw error
    }
  }

  // Déconnexion
  const logout = async () => {
    await authService.logout()
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // Valeurs partagées via le contexte
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
