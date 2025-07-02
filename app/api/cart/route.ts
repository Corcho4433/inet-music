import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        package: {
          include: {
            services: {
              include: {
                service: true,
              },
            },
          },
        },
        trip: {
          include: {
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const { itemType, packageId, tripId, quantity = 1 } = await request.json()

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        itemType,
        packageId,
        tripId,
        quantity,
      },
      include: {
        package: {
          include: {
            services: {
              include: {
                service: true,
              },
            },
          },
        },
        trip: {
          include: {
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
})
