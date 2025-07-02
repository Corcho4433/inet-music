import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rutas protegidas que requieren autenticación
const protectedPaths = ["/account", "/cart", "/checkout"]

export function middleware(request: NextRequest) {
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

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
} 