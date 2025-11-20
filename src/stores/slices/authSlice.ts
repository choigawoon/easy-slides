/**
 * Auth Slice - Manages authentication state
 *
 * Purpose: Handle user authentication, session management
 * Use cases: Login, logout, user profile, session persistence
 */

import type { StateCreator } from 'zustand'

export interface User {
  id: number
  email: string
  username: string
  fullName: string
  avatar?: string
}

export interface AuthSlice {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  ...initialState,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    })
  },

  setToken: (token) => {
    set({ token })
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  },

  login: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    })
    localStorage.setItem('auth_token', token)
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    localStorage.removeItem('auth_token')
  },

  setLoading: (isLoading) => {
    set({ isLoading })
  },

  reset: () => {
    set(initialState)
    localStorage.removeItem('auth_token')
  },
})
