"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plane, Hotel, MapPin, Car, Plus, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: string
  type: "FLIGHT" | "LODGING" | "ACTIVITY" | "TRANSPORT"
  name: string
  description?: string
  price: number
  metadata: any
}

interface Trip {
  id: string
  name: string
  services: Array<{
    service: Service
    quantity: number
  }>
}

const serviceIcons = {
  FLIGHT: Plane,
  LODGING: Hotel,
  ACTIVITY: MapPin,
  TRANSPORT: Car,
}

export default function TripBuilderPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [serviceType, setServiceType] = useState<string>("FLIGHT")
  const [newTripName, setNewTripName] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTrips()
    fetchServices()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips", {
        headers: {
          "x-user-id": "user1",
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch trips")
      }
      const data = await response.json()
      const tripsArray = Array.isArray(data) ? data : []
      setTrips(tripsArray)
      if (tripsArray.length > 0 && !selectedTrip) {
        setSelectedTrip(tripsArray[0])
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
      setTrips([])
      toast({
        title: "Error",
        description: "No se pudieron cargar los viajes",
        variant: "destructive",
      })
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/services?type=${serviceType}`)
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [serviceType])

  const createTrip = async () => {
    if (!newTripName.trim()) return

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user1",
        },
        body: JSON.stringify({ name: newTripName }),
      })

      if (response.ok) {
        const newTrip = await response.json()
        setTrips([newTrip, ...trips])
        setSelectedTrip(newTrip)
        setNewTripName("")
        toast({
          title: "Éxito",
          description: "¡Nuevo viaje creado!",
        })
      }
    } catch (error) {
      console.error("Error creating trip:", error)
      toast({
        title: "Error",
        description: "Error al crear el viaje",
        variant: "destructive",
      })
    }
  }

  const addServiceToTrip = async (serviceId: string) => {
    if (!selectedTrip) return

    try {
      const response = await fetch(`/api/trips/${selectedTrip.id}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user1",
        },
        body: JSON.stringify({ serviceId, quantity: 1 }),
      })

      if (response.ok) {
        await fetchTrips()
        toast({
          title: "Éxito",
          description: "¡Servicio añadido al viaje!",
        })
      }
    } catch (error) {
      console.error("Error adding service:", error)
      toast({
        title: "Error",
        description: "Error al añadir el servicio al viaje",
        variant: "destructive",
      })
    }
  }

  const removeServiceFromTrip = async (serviceId: string) => {
    if (!selectedTrip) return

    try {
      const response = await fetch(`/api/trips/${selectedTrip.id}/services?serviceId=${serviceId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": "user1",
        },
      })

      if (response.ok) {
        await fetchTrips()
        toast({
          title: "Éxito",
          description: "¡Servicio eliminado del viaje!",
        })
      }
    } catch (error) {
      console.error("Error removing service:", error)
      toast({
        title: "Error",
        description: "Error al eliminar el servicio del viaje",
        variant: "destructive",
      })
    }
  }

  const addTripToCart = async () => {
    if (!selectedTrip) return

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user1",
        },
        body: JSON.stringify({
          itemType: "TRIP",
          tripId: selectedTrip.id,
          quantity: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "¡Viaje añadido al carrito!",
        })
      }
    } catch (error) {
      console.error("Error adding trip to cart:", error)
      toast({
        title: "Error",
        description: "Error al añadir el viaje al carrito",
        variant: "destructive",
      })
    }
  }

  const getTripTotal = (trip: Trip) => {
    return trip.services.reduce((total, item) => {
      return total + item.service.price * item.quantity
    }, 0)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Cargando constructor de viajes...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Constructor de Viajes</h1>
        <p className="text-gray-600 mb-6">Crea tu viaje personalizado seleccionando servicios individuales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip Management */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tus Viajes</CardTitle>
              <CardDescription>Gestiona tus viajes personalizados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create New Trip */}
              <div className="space-y-2">
                <Label htmlFor="tripName">Nombre del Nuevo Viaje</Label>
                <div className="flex gap-2">
                  <Input
                    id="tripName"
                    placeholder="Ingresa el nombre del viaje"
                    value={newTripName}
                    onChange={(e) => setNewTripName(e.target.value)}
                  />
                  <Button onClick={createTrip} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Trip List */}
              <div className="space-y-2">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedTrip?.id === trip.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <div className="font-medium">{trip.name}</div>
                    <div className="text-sm text-gray-500">
                      {trip.services.length} servicios • ${getTripTotal(trip).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {selectedTrip && (
                <Button onClick={addTripToCart} className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Añadir al Carrito
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Current Trip Details */}
          {selectedTrip && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{selectedTrip.name}</CardTitle>
                <CardDescription>Servicios del viaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedTrip.services.map((item) => {
                    const Icon = serviceIcons[item.service.type]
                    return (
                      <div key={item.service.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium text-sm">{item.service.name}</div>
                            <div className="text-xs text-gray-500">${item.service.price}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => removeServiceFromTrip(item.service.id)}>
                          Eliminar
                        </Button>
                      </div>
                    )
                  })}
                  {selectedTrip.services.length === 0 && <p className="text-gray-500 text-sm">No hay servicios añadidos aún</p>}
                  <div className="pt-2 border-t font-medium">Total: ${getTripTotal(selectedTrip).toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Service Browser */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Explorar Servicios</CardTitle>
              <CardDescription>Añade servicios a tu viaje</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={serviceType} onValueChange={setServiceType}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="FLIGHT">Vuelos</TabsTrigger>
                  <TabsTrigger value="LODGING">Hoteles</TabsTrigger>
                  <TabsTrigger value="ACTIVITY">Actividades</TabsTrigger>
                  <TabsTrigger value="TRANSPORT">Transporte</TabsTrigger>
                </TabsList>

                <TabsContent value={serviceType} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => {
                      const Icon = serviceIcons[service.type]
                      return (
                        <Card key={service.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                            </div>
                            {service.description && <CardDescription>{service.description}</CardDescription>}
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-green-600">${service.price.toLocaleString()}</div>
                              <Button onClick={() => addServiceToTrip(service.id)} disabled={!selectedTrip}>
                                <Plus className="h-4 w-4 mr-2" />
                                Añadir
                              </Button>
                            </div>

                            {/* Service metadata */}
                            <div className="mt-3 space-y-1 text-sm text-gray-600">
                              {service.type === "FLIGHT" && service.metadata && (
                                <>
                                  <div>
                                    {service.metadata.origin} → {service.metadata.destination}
                                  </div>
                                  <div>
                                    {service.metadata.airline} • {service.metadata.flightNumber}
                                  </div>
                                </>
                              )}
                              {service.type === "LODGING" && service.metadata && (
                                <>
                                  <div>{service.metadata.hotelName}</div>
                                  <div>{service.metadata.location}</div>
                                  <div>{service.metadata.roomType}</div>
                                </>
                              )}
                              {service.type === "ACTIVITY" && service.metadata && (
                                <>
                                  <div>{service.metadata.location}</div>
                                  <div>Duración: {service.metadata.duration}</div>
                                </>
                              )}
                              {service.type === "TRANSPORT" && service.metadata && (
                                <>
                                  <div>{service.metadata.type}</div>
                                  <div>
                                    {service.metadata.origin} → {service.metadata.destination}
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
