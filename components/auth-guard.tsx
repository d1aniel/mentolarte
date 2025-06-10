"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { authService } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkAuth = () => {
      // Si estamos en la página de login, permitir acceso
      if (pathname === "/login") {
        setAuthenticated(true)
        setLoading(false)
        return
      }

      // Verificar autenticación
      const isAuth = authService.isAuthenticated()
      setAuthenticated(isAuth)

      if (!isAuth) {
        // Redirigir al login después de un pequeño delay
        setTimeout(() => {
          router.push("/login")
        }, 100)
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, pathname, mounted])

  // Mostrar loading mientras se monta el componente
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
          <p className="mt-2">Cargando aplicación...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado y no está en login, mostrar loading
  if (!authenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
          <p className="mt-2">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
