"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()

    useEffect(() => {
        // Si ya hay un usuario logueado, redirigir
        const userStr = localStorage.getItem("user")
        if (userStr) {
            const redirectTo = searchParams.get("redirect") || "/account"
            router.push(redirectTo)
        }
    }, [router, searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Error al iniciar sesión")
            }

            // Guardar información del usuario
            localStorage.setItem("user", JSON.stringify(data))

            toast({
                title: "¡Bienvenido!",
                description: "Has iniciado sesión correctamente",
            })

            // Redirigir a la página solicitada o a la cuenta
            const redirectTo = searchParams.get("redirect") || "/account"
            router.push(redirectTo)
        } catch (error) {
            console.error("Error logging in:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al iniciar sesión",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Iniciar Sesión</CardTitle>
                        <CardDescription>Ingresa a tu cuenta para ver tu historial de compras</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>
                            <div className="text-center text-sm text-gray-500 mt-4">
                                ¿No tienes una cuenta?{" "}
                                <Link href="/register" className="text-primary hover:underline">
                                    Regístrate aquí
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 