import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json(
        { error: "No hay sesión activa" },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error getting session:", error)
    return NextResponse.json(
      { error: "Error al obtener la sesión" },
      { status: 500 }
    )
  }
} 