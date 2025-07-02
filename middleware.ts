import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key_change_this"
)

// Rutas protegidas que requieren autenticación
const protectedPaths = ["/account", "/cart", "/checkout", "/trip-builder"]

// Rutas de autenticación
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Si es una ruta de autenticación y el usuario ya está autenticado,
    // redirigir a la página principal
    if (authPaths.includes(path)) {
        try {
            const session = request.cookies.get("session")
            if (session) {
                await jwtVerify(session.value, JWT_SECRET)
                // Si el usuario está intentando ir a login/register y ya está autenticado,
                // verificar si hay una redirección solicitada
                const redirectTo = request.nextUrl.searchParams.get("redirect")
                if (redirectTo && !authPaths.includes(redirectTo)) {
                    return NextResponse.redirect(new URL(redirectTo, request.url))
                }
                return NextResponse.redirect(new URL("/", request.url))
            }
        } catch {
            // Si el token no es válido, permitir el acceso a las rutas de autenticación
            // y eliminar la cookie inválida
            const response = NextResponse.next()
            response.cookies.delete("session")
            return response
        }
    }

    // Verificar si la ruta actual requiere autenticación
    if (protectedPaths.some(prefix => path.startsWith(prefix))) {
        try {
            const session = request.cookies.get("session")
            if (!session) {
                throw new Error("No session cookie")
            }

            await jwtVerify(session.value, JWT_SECRET)
            return NextResponse.next()
        } catch (error) {
            // Si hay un error con la sesión, eliminar la cookie
            const response = NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url))
            response.cookies.delete("session")
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
} 