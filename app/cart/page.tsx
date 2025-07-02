"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

interface CartItem {
  id: string
  package?: {
    id: string
    name: string
    description: string
    destination: string
    duration: number
    price: number
    imageUrl: string
  }
  trip?: {
    id: string
    name: string
    services: {
      service: {
        id: string
        name: string
        type: string
        price: number
      }
    }[]
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?redirect=/cart')
          return
        }
        throw new Error('Error al cargar el carrito')
      }
      const data = await response.json()
      setItems(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al cargar el carrito',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el item')
      }

      setItems(items.filter(item => item.id !== itemId))
      toast({
        title: 'Item eliminado',
        description: 'El item ha sido eliminado del carrito',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar el item',
        variant: 'destructive',
      })
    }
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Error al procesar el checkout')
      }

      toast({
        title: 'Compra exitosa',
        description: 'Tu compra ha sido procesada correctamente',
      })

      router.push('/account')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al procesar el checkout',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Cargando carrito...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Carrito de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">Tu carrito está vacío</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/packages')}
              >
                Ver Paquetes Disponibles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      if (item.package) {
        return total + item.package.price
      }
      if (item.trip) {
        return total + item.trip.services.reduce(
          (acc, service) => acc + service.service.price,
          0
        )
      }
      return total
    }, 0)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Carrito de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                {item.package && (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.package.name}</h3>
                        <p className="text-sm text-gray-600">{item.package.description}</p>
                        <p className="text-sm text-gray-600">
                          {item.package.destination} - {item.package.duration} días
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.package.price.toLocaleString()}</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {item.trip && (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.trip.name}</h3>
                        <div className="mt-2 space-y-1">
                          {item.trip.services.map((service, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              {service.service.name} - ${service.service.price.toLocaleString()}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          $
                          {item.trip.services
                            .reduce((acc, service) => acc + service.service.price, 0)
                            .toLocaleString()}
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-lg font-semibold">${calculateTotal().toLocaleString()}</div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCheckout} className="w-full md:w-auto">
                Proceder al Pago
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
