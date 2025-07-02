import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple auth - in production, use proper authentication
export function getCurrentUser(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "user1"
  return userId
}

type HandlerWithParams<T extends Record<string, string> = Record<string, string>> = (
  req: NextRequest,
  userId: string,
  context: { params: T }
) => Promise<Response>

export function withAuth<T extends Record<string, string> = Record<string, string>>(
  handler: HandlerWithParams<T>
) {
  return async (req: NextRequest, context: { params: T }) => {
    const userId = getCurrentUser(req)
    return handler(req, userId, context)
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
