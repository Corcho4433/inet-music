"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrderItem {
  id: string
  package?: {
    name: string
    description: string
    destination: string
    duration: number
    price: number
    imageUrl: string
  }
  trip?: {
    name: string
    services: {
      service: {
        name: string
        type: string
        price: number
      }
    }[]
  }
}

interface Order {
  id: string
  createdAt: string
  total: number
  items: OrderItem[]
}

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/history')
        if (!response.ok) {
          throw new Error('Error al cargar el historial de compras')
        }
        const data = await response.json()
        setOrders(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div className="p-8">Cargando historial de compras...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  if (orders.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Mi Cuenta</h1>
        <p>Aún no has realizado ninguna compra.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mi Cuenta</h1>
      <h2 className="text-xl mb-4">Historial de Compras</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Orden #{order.id.slice(0, 8)}</CardTitle>
              <CardDescription>
                {format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {order.items.map((item) => (
                <div key={item.id} className="mb-4">
                  {item.package && (
                    <>
                      <h3 className="font-semibold">{item.package.name}</h3>
                      <p className="text-sm text-gray-600">{item.package.destination}</p>
                      <p className="text-sm text-gray-600">{item.package.duration} días</p>
                      <p className="text-sm font-semibold">${item.package.price.toLocaleString()}</p>
                    </>
                  )}
                  {item.trip && (
                    <>
                      <h3 className="font-semibold">{item.trip.name}</h3>
                      <div className="ml-4">
                        {item.trip.services.map((service, idx) => (
                          <div key={idx} className="text-sm">
                            <span>{service.service.name}</span>
                            <span className="text-gray-600"> - ${service.service.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <Separator className="my-2" />
                </div>
              ))}
              <div className="text-right font-bold">
                Total: ${order.total.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 