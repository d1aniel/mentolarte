"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { MentolarteLogo } from "@/components/mentolarte-logo"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex items-center">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <MentolarteLogo showText={true} size="sm" />
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-mentolarte-red",
            pathname === "/" ? "text-mentolarte-green font-bold" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/inventario"
          className={cn(
            "transition-colors hover:text-mentolarte-red",
            pathname?.startsWith("/inventario") ? "text-mentolarte-green font-bold" : "text-foreground/60",
          )}
        >
          Inventario
        </Link>
        <Link
          href="/ventas"
          className={cn(
            "transition-colors hover:text-mentolarte-red",
            pathname?.startsWith("/ventas") ? "text-mentolarte-green font-bold" : "text-foreground/60",
          )}
        >
          Ventas
        </Link>
        <Link
          href="/estadisticas"
          className={cn(
            "transition-colors hover:text-mentolarte-red",
            pathname?.startsWith("/estadisticas") ? "text-mentolarte-green font-bold" : "text-foreground/60",
          )}
        >
          Estadísticas
        </Link>
      </nav>
    </div>
  )
}
