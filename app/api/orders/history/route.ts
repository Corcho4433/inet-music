import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const GET = withAuth(async (request: Request, userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            package: {
              select: {
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
                name: true,
                services: {
                  include: {
                    service: {
                      select: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching order history:", error)
    return NextResponse.json(
      { error: "Error al obtener el historial de compras" },
      { status: 500 }
    )
  }
}) 