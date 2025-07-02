"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Package, MapPin, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  itemType: "PACKAGE" | "TRIP"
  quantity: number
  package?: {
    id: string
    name: string
    description: string
    destination: string
    duration: number
    price: number
    imageUrl?: string
    services: Array<{
      service: {
        name: string
        type: string
      }
    }>
  }
  trip?: {
    id: string
    name: string
    services: Array<{
      service: {
        id: string
        name: string
        type: string
        price: number
      }
      quantity: number
    }>
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        headers: {
          "x-user-id": "user1",
        },
      })
      const data = await response.json()
      setCartItems(data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Error al cargar el carrito",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": "user1",
        },
      })

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.id !== itemId))
        toast({
          title: "Éxito",
          description: "Artículo eliminado del carrito",
        })
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Error al eliminar el artículo del carrito",
        variant: "destructive",
      })
    }
  }

  const getItemPrice = (item: CartItem) => {
    if (item.package) {
      return item.package.price * item.quantity
    }
    if (item.trip) {
      const tripTotal = item.trip.services.reduce((total, service) => {
        return total + service.service.price * service.quantity
      }, 0)
      return tripTotal * item.quantity
    }
    return 0
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + getItemPrice(item), 0)
  }

  const groupedItems = cartItems.reduce(
    (groups, item) => {
      const type = item.itemType
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(item)
      return groups
    },
    {} as Record<string, CartItem[]>,
  )

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      router.push("/checkout")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Cargando carrito...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Carrito de Compras</h1>
        <p className="text-gray-600">Revisa tus paquetes y viajes personalizados antes de finalizar la compra.</p>
      </div>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-600 mb-6">Comienza explorando nuestros paquetes o creando un viaje personalizado.</p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="/packages">Ver Paquetes</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/trip-builder">Crear Viaje</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Packages Section */}
            {groupedItems.PACKAGE && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Paquetes
                </h2>
                <div className="space-y-4">
                  {groupedItems.PACKAGE.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={item.package?.imageUrl || "/placeholder.svg?height=100&width=100"}
                              alt={item.package?.name || ""}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.package?.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{item.package?.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {item.package?.destination}
                              </span>
                              <span>{item.package?.duration} days</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.package?.services.slice(0, 4).map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {service.service.type.toLowerCase()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              ${getItemPrice(item).toLocaleString()}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Trips Section */}
            {groupedItems.TRIP && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Viajes Personalizados
                </h2>
                <div className="space-y-4">
                  {groupedItems.TRIP.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{item.trip?.name}</h3>
                            <p className="text-gray-600 text-sm">{item.trip?.services.length} services included</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              ${getItemPrice(item).toLocaleString()}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {item.trip?.services.map((service) => (
                            <div key={service.service.id} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {service.service.type.toLowerCase()}
                                </Badge>
                                <span>{service.service.name}</span>
                              </div>
                              <span className="font-medium">
                                ${(service.service.price * service.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate">{item.package?.name || item.trip?.name}</span>
                      <span>${getItemPrice(item).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                  Proceder al Pago
                </Button>

                <p className="text-xs text-gray-500 text-center">Pago seguro proporcionado por Sterling Travel</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
