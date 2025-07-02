import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        userId,
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(trips)
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json([], { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const { name } = await request.json()

    const trip = await prisma.trip.create({
      data: {
        name,
        userId,
        status: "DRAFT",
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    })

    return NextResponse.json(trip)
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 })
  }
})
