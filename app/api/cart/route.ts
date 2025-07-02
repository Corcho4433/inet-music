import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const GET = withAuth(async (request: Request, userId: string) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        package: {
          select: {
            name: true,
            price: true,
            imageUrl: true,
          },
        },
        trip: {
          select: {
            name: true,
            services: {
              include: {
                service: {
                  select: {
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Error al obtener el carrito" },
      { status: 500 }
    )
  }
})

export const POST = withAuth(async (request: Request, userId: string) => {
  try {
    const { itemType, packageId, tripId, quantity = 1 } = await request.json()

    // Validar campos requeridos
    if (!itemType || (!packageId && !tripId)) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el item ya existe en el carrito
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        itemType,
        ...(packageId ? { packageId } : { tripId }),
      },
    })

    if (existingItem) {
      // Actualizar cantidad si ya existe
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      })
      return NextResponse.json(updatedItem)
    }

    // Crear nuevo item en el carrito
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        itemType,
        packageId,
        tripId,
        quantity,
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
