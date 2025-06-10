"use client"

import type React from "react"
import { useEffect } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthGuard } from "@/components/auth-guard"
import { Toaster } from "@/components/ui/toaster"
import { ConditionalLayout } from "@/components/conditional-layout"
import { initializeDatabase } from "@/lib/init-db"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Inicializar la base de datos cuando se carga la aplicación
    initializeDatabase()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthGuard>
        <ConditionalLayout>{children}</ConditionalLayout>
      </AuthGuard>
      <Toaster />
    </ThemeProvider>
  )
}
