"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, X } from "lucide-react"

export function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchCartCount()
  }, [])

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart", {
        headers: {
          "x-user-id": "user1",
        },
      })
      const data = await response.json()
      setCartCount(data.length)
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Paquetes", href: "/packages" },
    { name: "Crear Viaje", href: "/trip-builder" },
    { name: "Carrito", href: "/cart" },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">Sterling Travel</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name === "Carrito" ? (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Carrito
                    {cartCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </div>
                ) : (
                  item.name
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name === "Carrito" ? (
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Carrito
                      {cartCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {cartCount}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    item.name
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
