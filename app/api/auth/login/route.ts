import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // Validar campos requeridos
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email y contraseña son requeridos" },
                { status: 400 }
            )
        }

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
            },
        })

        if (!user || !user.password) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            )
        }

        // Verificar contraseña
        const isValid = await verifyPassword(password, user.password)

        if (!isValid) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            )
        }

        // Crear sesión
        await createSession(user)

        return NextResponse.json({
            id: user.id,
            email: user.email,
        })
    } catch (error) {
        console.error("Error in login:", error)
        return NextResponse.json(
            { error: "Error al iniciar sesión" },
            { status: 500 }
        )
    }
} 