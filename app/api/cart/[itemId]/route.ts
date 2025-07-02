import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const DELETE = withAuth(async (request: Request, userId: string) => {
  try {
    const itemId = request.url.split("/").pop()

    if (!itemId) {
      return NextResponse.json(
        { error: "ID del item no proporcionado" },
        { status: 400 }
      )
    }

    // Verificar que el item pertenece al usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item no encontrado" },
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
    console.error("Error deleting cart item:", error)
    return NextResponse.json(
      { error: "Error al eliminar el item del carrito" },
      { status: 500 }
    )
  }
})
