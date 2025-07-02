import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "./prisma"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key_change_this"
)

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(user: { id: string; email: string }) {
  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })

  return token
}

export async function getSessionUser() {
  const sessionCookie = cookies().get("session")
  
  if (!sessionCookie?.value) {
    return null
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET)
    const userId = payload.userId as string

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
}

export async function clearSession() {
  cookies().delete("session")
}

export function withAuth(handler: (request: Request, userId: string) => Promise<Response>) {
  return async (request: Request) => {
    const user = await getSessionUser()

    if (!user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    return handler(request, user.id)
  }
}

export async function middleware(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  const protectedPaths = ["/account", "/cart", "/checkout"]
  const path = request.nextUrl.pathname

  // Verificar si la ruta actual requiere autenticación
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    // En un entorno real, aquí verificaríamos un token JWT o una sesión
    // Por ahora, solo verificamos si existe el usuario en localStorage
    const user = request.cookies.get("user")

    if (!user) {
      // Redirigir a login si no hay usuario
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}
