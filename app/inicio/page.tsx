"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { authService } from "@/lib/auth"

export default function InicioPage() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si está autenticado
    if (authService.isAuthenticated()) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
        <p className="mt-2">Redirigiendo...</p>
      </div>
    </div>
  )
}
