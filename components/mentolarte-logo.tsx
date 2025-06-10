import Image from "next/image"
import type { SVGProps } from "react"

export function MentolarteLogo(props: SVGProps<SVGSVGElement> & { showText?: boolean; size?: "sm" | "md" | "lg" }) {
  const { showText = false, size = "md", ...svgProps } = props

  const sizeClasses = {
    sm: showText ? "w-8 h-8" : "w-8 h-8",
    md: showText ? "w-12 h-12" : "w-10 h-10",
    lg: showText ? "w-20 h-20" : "w-16 h-16",
  }

  return (
    <div className="flex items-center">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-mentolarte-green shadow-sm`}>
        <Image
          src="/images/logo.png"
          alt="Mentolarte Logo"
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>
      {showText && <span className="ml-3 text-mentolarte-red font-semibold text-lg">Alivio hecho con amor</span>}
    </div>
  )
}
