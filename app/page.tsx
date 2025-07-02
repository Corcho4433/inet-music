import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, MapPin, Calendar, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Plataforma de Viajes Sterling</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre experiencias de viaje increíbles con nuestros paquetes seleccionados o construye tu viaje personalizado perfecto. ¡Tu
            aventura te espera!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/packages">Explorar Paquetes</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/trip-builder">Crear Viaje Personalizado</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir Sterling Travel?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Plane className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>Paquetes Seleccionados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Paquetes de viaje diseñados por expertos con vuelos, hoteles y actividades incluidos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <CardTitle>Viajes Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Construye tu viaje perfecto seleccionando servicios individuales que se ajusten a tus preferencias.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <CardTitle>Planificación Flexible</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gestiona múltiples viajes, guarda para más tarde y modifica tus planes hasta que estés listo para reservar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                <CardTitle>Soporte Experto</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nuestros expertos en viajes están aquí para ayudarte a crear experiencias inolvidables.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para Comenzar tu Viaje?</h2>
          <p className="text-xl mb-8">
            Únete a miles de viajeros que han descubierto su viaje perfecto con Sterling Travel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/packages">Ver Paquetes</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/cart">Ver Carrito</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
