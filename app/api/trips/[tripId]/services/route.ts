import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const POST = withAuth(
  async (request: NextRequest, userId: string, { params }: { params: { tripId: string } }) => {
    try {
      const { serviceId, quantity = 1 } = await request.json()
      const { tripId } = params

      // Verify trip belongs to user
      const trip = await prisma.trip.findFirst({
        where: {
          id: tripId,
          userId,
        },
      })

      if (!trip) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 })
      }

      const tripService = await prisma.tripService.upsert({
        where: {
          tripId_serviceId: {
            tripId,
            serviceId,
          },
        },
        update: {
          quantity,
        },
        create: {
          tripId,
          serviceId,
          quantity,
        },
        include: {
          service: true,
        },
      })

      return NextResponse.json(tripService)
    } catch (error) {
      console.error("Error adding service to trip:", error)
      return NextResponse.json({ error: "Failed to add service to trip" }, { status: 500 })
    }
  },
)

export const DELETE = withAuth(
  async (request: NextRequest, userId: string, { params }: { params: { tripId: string } }) => {
    try {
      const { searchParams } = new URL(request.url)
      const serviceId = searchParams.get("serviceId")
      const { tripId } = params

      if (!serviceId) {
        return NextResponse.json({ error: "Service ID required" }, { status: 400 })
      }

      // Verify trip belongs to user
      const trip = await prisma.trip.findFirst({
        where: {
          id: tripId,
          userId,
        },
      })

      if (!trip) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 })
      }

      await prisma.tripService.delete({
        where: {
          tripId_serviceId: {
            tripId,
            serviceId,
          },
        },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error removing service from trip:", error)
      return NextResponse.json({ error: "Failed to remove service from trip" }, { status: 500 })
    }
  },
)
