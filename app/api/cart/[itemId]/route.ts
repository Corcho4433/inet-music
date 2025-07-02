import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const DELETE = withAuth(async (request: Request, userId: string) => {
  try {
    // Extraer el itemId de la URL
    const itemId = request.url.split('/cart/')[1]

    // Verificar que el item pertenece al usuario
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: itemId,
        userId,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item no encontrado o no autorizado" },
        { status: 404 }
      )
    }

    // Eliminar el item
    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing item from cart:", error)
    return NextResponse.json(
      { error: "Error al eliminar el item del carrito" },
      { status: 500 }
    )
  }
})
