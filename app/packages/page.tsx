"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Package {
  id: string
  name: string
  description: string
  destination: string
  duration: number
  price: number
  imageUrl?: string
  services: Array<{
    service: {
      id: string
      name: string
      type: string
      price: number
    }
  }>
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    destination: "",
    minPrice: "",
    maxPrice: "",
    duration: "any", // Updated default value
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPackages()
  }, [filters])

  const fetchPackages = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.destination) params.append("destination", filters.destination)
      if (filters.minPrice) params.append("minPrice", filters.minPrice)
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)
      if (filters.duration !== "any") params.append("duration", filters.duration) // Updated condition

      const response = await fetch(`/api/packages?${params}`)
      const data = await response.json()
      setPackages(data)
    } catch (error) {
      console.error("Error fetching packages:", error)
      toast({
        title: "Error",
        description: "Error al cargar los paquetes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (packageId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user1", // Simple auth
        },
        body: JSON.stringify({
          itemType: "PACKAGE",
          packageId,
          quantity: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "¡Paquete añadido al carrito!",
        })
      } else {
        throw new Error("Error al añadir al carrito")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Error al añadir el paquete al carrito",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Cargando paquetes...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Paquetes de Viaje</h1>
        <p className="text-gray-600 mb-6">
          Descubre nuestros paquetes de viaje seleccionados con todo incluido para tu escapada perfecta.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <Label htmlFor="destination">Destino</Label>
            <Input
              id="destination"
              placeholder="Buscar destinos..."
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="minPrice">Precio Mínimo</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="Precio mínimo"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Precio Máximo</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Precio máximo"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="duration">Duración</Label>
            <Select value={filters.duration} onValueChange={(value) => setFilters({ ...filters, duration: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Cualquier duración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier duración</SelectItem>
                <SelectItem value="3">3 días</SelectItem>
                <SelectItem value="5">5 días</SelectItem>
                <SelectItem value="7">7 días</SelectItem>
                <SelectItem value="10">10+ días</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={pkg.imageUrl || "/placeholder.svg?height=200&width=400"}
                alt={pkg.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{pkg.name}</CardTitle>
              <CardDescription className="line-clamp-3">{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {pkg.destination}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {pkg.duration} días
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-2xl font-bold text-green-600">${pkg.price.toLocaleString()}</span>
                </div>

                {/* Services included */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {pkg.services.slice(0, 3).map((service) => (
                    <Badge key={service.service.id} variant="secondary" className="text-xs">
                      {service.service.type.toLowerCase()}
                    </Badge>
                  ))}
                  {pkg.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{pkg.services.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button className="w-full mt-4" onClick={() => addToCart(pkg.id)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Añadir al Carrito
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron paquetes que coincidan con tus criterios.</p>
        </div>
      )}
    </div>
  )
}
