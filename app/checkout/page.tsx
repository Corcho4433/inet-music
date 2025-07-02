"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Package, MapPin } from "lucide-react"

interface CartItem {
    id: string
    itemType: "PACKAGE" | "TRIP"
    quantity: number
    package?: {
        name: string
        price: number
        imageUrl: string
    }
    trip?: {
        name: string
        services: Array<{
            service: {
                price: number
            }
        }>
    }
}

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        fetchCartItems()
    }, [])

    const fetchCartItems = async () => {
        try {
            const userStr = localStorage.getItem("user")
            if (!userStr) {
                router.push("/login")
                return
            }

            const user = JSON.parse(userStr)
            const response = await fetch("/api/cart", {
                headers: {
                    "x-user-id": user.id,
                },
            })

            if (!response.ok) {
                throw new Error("Error al cargar el carrito")
            }

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

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            let price = 0
            if (item.package) {
                price = item.package.price
            } else if (item.trip) {
                price = item.trip.services.reduce(
                    (acc, service) => acc + Number(service.service.price),
                    0
                )
            }
            return total + price * item.quantity
        }, 0)
    }

    const handleCheckout = async () => {
        try {
            setProcessing(true)
            const userStr = localStorage.getItem("user")
            if (!userStr) {
                router.push("/login")
                return
            }

            const user = JSON.parse(userStr)
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.id,
                },
            })

            if (!response.ok) {
                throw new Error("Error al procesar el pago")
            }

            toast({
                title: "¡Compra exitosa!",
                description: "Tu orden ha sido procesada correctamente",
            })

            router.push("/account")
        } catch (error) {
            console.error("Error processing checkout:", error)
            toast({
                title: "Error",
                description: "Error al procesar el pago",
                variant: "destructive",
            })
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">Cargando información del carrito...</div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center">
                            <p className="text-gray-500">Tu carrito está vacío</p>
                            <Button className="mt-4" onClick={() => router.push("/packages")}>
                                Ver Paquetes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Finalizar Compra</CardTitle>
                        <CardDescription>Revisa y confirma tu orden</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    {item.package?.imageUrl && (
                                        <div className="relative w-24 h-24">
                                            <Image
                                                src={item.package.imageUrl}
                                                alt={item.package.name}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {item.itemType === "PACKAGE" ? (
                                                <Package className="h-4 w-4" />
                                            ) : (
                                                <MapPin className="h-4 w-4" />
                                            )}
                                            <span className="font-medium">
                                                {item.package?.name || item.trip?.name}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Cantidad: {item.quantity}
                                        </div>
                                        <div className="font-medium mt-1">
                                            $
                                            {(
                                                (item.package?.price ||
                                                    item.trip?.services.reduce(
                                                        (acc, service) => acc + Number(service.service.price),
                                                        0
                                                    ) ||
                                                    0) * item.quantity
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Separator />

                            <div className="flex justify-between items-center py-4">
                                <span className="font-semibold text-lg">Total</span>
                                <span className="font-semibold text-lg">
                                    ${calculateTotal().toLocaleString()}
                                </span>
                            </div>

                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleCheckout}
                                disabled={processing}
                            >
                                {processing ? "Procesando..." : "Confirmar y Pagar"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 