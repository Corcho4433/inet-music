"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface CartItem {
    id: string
    itemType: "PACKAGE" | "TRIP"
    quantity: number
    package?: {
        id: string
        name: string
        price: number
    }
    trip?: {
        id: string
        name: string
        services: Array<{
            service: {
                price: number
            }
            quantity: number
        }>
    }
}

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        fetchCartItems()
    }, [])

    const fetchCartItems = async () => {
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
                description: "Error al cargar los items del carrito",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const getItemPrice = (item: CartItem) => {
        if (item.package) {
            return item.package.price * item.quantity
        }
        if (item.trip) {
            return (
                item.trip.services.reduce((total, service) => {
                    return total + service.service.price * service.quantity
                }, 0) * item.quantity
            )
        }
        return 0
    }

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + getItemPrice(item), 0)
    }

    const handlePayment = async () => {
        try {
            // Aquí iría la integración con el sistema de pagos
            toast({
                title: "Éxito",
                description: "¡Pago procesado correctamente!",
            })
            // Redirigir a una página de confirmación o inicio
            router.push("/")
        } catch (error) {
            console.error("Error processing payment:", error)
            toast({
                title: "Error",
                description: "Error al procesar el pago",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">Cargando checkout...</div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        router.push("/cart")
        return null
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Resumen del Pedido</CardTitle>
                        <CardDescription>Verifica los detalles de tu compra</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                                    <div>
                                        <div className="font-medium">
                                            {item.package?.name || item.trip?.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Cantidad: {item.quantity}
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        ${getItemPrice(item).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 font-bold">
                                <div>Total</div>
                                <div>${getTotalPrice().toLocaleString()}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button onClick={handlePayment} className="w-full" size="lg">
                    Proceder al Pago
                </Button>
            </div>
        </div>
    )
} 