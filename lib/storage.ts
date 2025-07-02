// Funciones para manejar el almacenamiento del usuario
export const storage = {
  getUser: () => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  setUser: (user: { id: string; email: string; name?: string }) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('user', JSON.stringify(user))
  },

  removeUser: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user')
  },
} 