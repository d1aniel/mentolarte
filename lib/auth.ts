// Sistema de autenticación simple
export interface User {
  id: string
  username: string
  name: string
  role: "admin" | "vendedor"
}

// Usuarios predefinidos (en producción esto vendría de una base de datos)
const users: User[] = [
  {
    id: "1",
    username: "admin",
    name: "Administrador",
    role: "admin",
  },
  {
    id: "2",
    username: "vendedor",
    name: "Vendedor",
    role: "vendedor",
  },
]

export class AuthService {
  private static instance: AuthService

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Validación simple (en producción usar hash de contraseñas)
    if (username === "admin" && password === "admin123") {
      const user = users.find((u) => u.username === "admin")!
      this.setCurrentUser(user)
      return { success: true, user }
    }

    if (username === "vendedor" && password === "vendedor123") {
      const user = users.find((u) => u.username === "vendedor")!
      this.setCurrentUser(user)
      return { success: true, user }
    }

    return { success: false, error: "Credenciales incorrectas" }
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  }

  getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("currentUser")
        return userStr ? JSON.parse(userStr) : null
      } catch (error) {
        console.error("Error parsing user data:", error)
        return null
      }
    }
    return null
  }

  private setCurrentUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const authService = AuthService.getInstance()
