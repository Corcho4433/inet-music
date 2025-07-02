"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa a tu cuenta para ver tu historial de compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="text-center text-sm text-gray-500 mt-4">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
