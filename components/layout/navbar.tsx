"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, ShoppingCart } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface UserInfo {
  id: string
  email: string
  name: string | null
  avatar: string | null
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const pathname = usePathname()
  const isMobile = useIsMobile()

  useEffect(() => {
    // Cargar información del usuario desde localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/packages", label: "Paquetes" },
    { href: "/trip-builder", label: "Arma tu Viaje" },
  ]

  const renderLinks = () => (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-gray-500"
            }`}
        >
          {link.label}
        </Link>
      ))}
    </>
  )

  const renderUserSection = () => (
    <div className="flex items-center gap-4">
      <Link href="/cart">
        <Button variant="ghost" size="icon">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </Link>
      {user ? (
        <Link href="/account">
          <Button variant="ghost" size="icon" className="relative">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || "Usuario"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button variant="outline">Iniciar Sesión</Button>
        </Link>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/placeholder-logo.svg" alt="Logo" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block">InetViaje</span>
          </Link>
        </div>

        {isMobile ? (
          <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <nav className="flex flex-col gap-4">
                  {renderLinks()}
                  <div className="mt-4">
                    {user ? (
                      <Link href="/account" className="flex items-center gap-2 py-2">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name || "Usuario"}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                        <span>{user.name || "Mi Cuenta"}</span>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <Button className="w-full">Iniciar Sesión</Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <Link href="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
              {renderLinks()}
            </nav>
            {renderUserSection()}
          </>
        )}
      </div>
    </header>
  )
}
