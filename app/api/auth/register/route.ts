import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json()

        // Validar campos requeridos
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email y contraseña son requeridos" },
                { status: 400 }
            )
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "El email ya está registrado" },
                { status: 400 }
            )
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear el usuario
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error registering user:", error)
        return NextResponse.json(
            { error: "Error al registrar el usuario" },
            { status: 500 }
        )
    }
} 