"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, MapPin, LogOut, Calendar, Clock, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserInfo {
    id: string
    email: string
    name: string | null
    avatar: string | null
}

interface OrderItem {
    id: string
    itemType: "PACKAGE" | "TRIP"
    quantity: number
    price: number
    metadata: {
        name: string
        originalPrice: number
    }
    package?: {
        name: string
    }
    trip?: {
        name: string
    }
}

interface Order {
    id: string
    status: "PENDING" | "COMPLETED" | "CANCELLED"
    total: number
    createdAt: string
    items: OrderItem[]
}

export default function AccountPage() {
    const [user, setUser] = useState<UserInfo | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        // Verificar si el usuario está logueado
        const userStr = localStorage.getItem("user")
        if (!userStr) {
            router.push("/login")
            return
        }

        const userData = JSON.parse(userStr)
        setUser(userData)

        // Cargar órdenes del usuario
        fetchOrders()
    }, [router])

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders", {
                headers: {
                    "x-user-id": user?.id || "",
                },
            })

            if (!response.ok) {
                throw new Error("Error al cargar el historial de compras")
            }

            const data = await response.json()
            setOrders(data)
        } catch (error) {
            console.error("Error fetching orders:", error)
            toast({
                title: "Error",
                description: "Error al cargar el historial de compras",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("user")
        toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión correctamente",
        })
        router.push("/login")
    }

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-800"
            case "PENDING":
                return "bg-yellow-100 text-yellow-800"
            case "CANCELLED":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (loading || !user) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">Cargando información de la cuenta...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Mi Cuenta</h1>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                    </Button>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="trips">Mis Viajes</TabsTrigger>
                        <TabsTrigger value="purchases">Historial de Compras</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Personal</CardTitle>
                                <CardDescription>Gestiona tu información de perfil</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-20">
                                        <Image
                                            src={user.avatar || "/placeholder-user.jpg"}
                                            alt={user.name || "Usuario"}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{user.name || "Usuario"}</h3>
                                        <p className="text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="trips">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mis Viajes</CardTitle>
                                <CardDescription>Viajes y paquetes que has comprado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {orders
                                        .filter((order) => order.status === "COMPLETED")
                                        .map((order) => (
                                            <div key={order.id}>
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-500">
                                                        Comprado el {formatDate(order.createdAt)}
                                                    </div>
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    {order.items.map((item) => (
                                                        <Card key={item.id}>
                                                            <CardContent className="p-4">
                                                                <div className="flex items-start gap-3">
                                                                    <div
                                                                        className={`p-2 rounded-lg ${item.itemType === "PACKAGE"
                                                                                ? "bg-blue-100 text-blue-700"
                                                                                : "bg-green-100 text-green-700"
                                                                            }`}
                                                                    >
                                                                        {item.itemType === "PACKAGE" ? (
                                                                            <Package className="h-5 w-5" />
                                                                        ) : (
                                                                            <MapPin className="h-5 w-5" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-medium">{item.metadata.name}</h4>
                                                                        <div className="mt-2 space-y-1 text-sm text-gray-500">
                                                                            <div className="flex items-center gap-1">
                                                                                <Calendar className="h-4 w-4" />
                                                                                <span>Comprado el {formatDate(order.createdAt)}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <Clock className="h-4 w-4" />
                                                                                <span>Cantidad: {item.quantity}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <DollarSign className="h-4 w-4" />
                                                                                <span>${item.price.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>

                                                <Separator className="my-6" />
                                            </div>
                                        ))}

                                    {!orders.some((order) => order.status === "COMPLETED") && (
                                        <div className="text-center py-8 text-gray-500">
                                            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                            <p>No tienes viajes comprados aún</p>
                                            <Button
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() => router.push("/packages")}
                                            >
                                                Ver Paquetes Disponibles
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="purchases">
                        <Card>
                            <CardHeader>
                                <CardTitle>Historial de Compras</CardTitle>
                                <CardDescription>Tus compras recientes y su estado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="font-medium">
                                                        Orden #{order.id.slice(0, 8)}
                                                        <Badge
                                                            className={`ml-2 ${getStatusColor(order.status)}`}
                                                        >
                                                            {order.status === "COMPLETED"
                                                                ? "Completada"
                                                                : order.status === "PENDING"
                                                                    ? "Pendiente"
                                                                    : "Cancelada"}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">${order.total.toLocaleString()}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                        <div className="flex items-center gap-2">
                                                            {item.itemType === "PACKAGE" ? (
                                                                <Package className="h-4 w-4" />
                                                            ) : (
                                                                <MapPin className="h-4 w-4" />
                                                            )}
                                                            <span>{item.metadata.name}</span>
                                                        </div>
                                                        <span className="font-medium">${item.price.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <Separator className="my-4" />
                                        </div>
                                    ))}

                                    {orders.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No tienes compras realizadas aún
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 