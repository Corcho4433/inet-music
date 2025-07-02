import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

// GET /api/cart - Obtener el carrito del usuario
export const GET = withAuth(async (request: Request, userId: string) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            description: true,
            destination: true,
            duration: true,
            price: true,
            imageUrl: true,
          },
        },
        trip: {
          select: {
            id: true,
            name: true,
            services: {
              include: {
                service: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Error al obtener el carrito" },
      { status: 500 }
    )
  }
})

// POST /api/cart - Agregar un item al carrito
export const POST = withAuth(async (request: Request, userId: string) => {
  try {
    const body = await request.json()
    const { packageId, tripId } = body

    if (!packageId && !tripId) {
      return NextResponse.json(
        { error: "Se requiere packageId o tripId" },
        { status: 400 }
      )
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        packageId,
        tripId,
        itemType: packageId ? "PACKAGE" : "TRIP",
      },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Error al agregar al carrito" },
      { status: 500 }
    )
  }
})

// DELETE /api/cart - Eliminar todos los items del carrito
export const DELETE = withAuth(async (request: Request, userId: string) => {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        userId,
      },
    })

    return NextResponse.json({ message: "Carrito vaciado exitosamente" })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json(
      { error: "Error al vaciar el carrito" },
      { status: 500 }
    )
  }
})
