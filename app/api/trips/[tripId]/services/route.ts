import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

// POST /api/trips/[tripId]/services - Agregar un servicio al viaje
export const POST = withAuth(async (request: Request, userId: string) => {
  try {
    // Extraer el tripId de la URL
    const tripId = request.url.split('/trips/')[1].split('/services')[0]
    const { serviceId } = await request.json()

    // Verificar que el viaje pertenece al usuario
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
        userId,
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: "Viaje no encontrado o no autorizado" },
        { status: 404 }
      )
    }

    // Agregar el servicio al viaje
    const tripService = await prisma.tripService.create({
      data: {
        tripId,
        serviceId,
      },
      include: {
        service: true,
      },
    })

    return NextResponse.json(tripService)
  } catch (error) {
    console.error("Error adding service to trip:", error)
    return NextResponse.json(
      { error: "Error al agregar el servicio al viaje" },
      { status: 500 }
    )
  }
})

// DELETE /api/trips/[tripId]/services - Eliminar un servicio del viaje
export const DELETE = withAuth(async (request: Request, userId: string) => {
  try {
    // Extraer el tripId de la URL
    const tripId = request.url.split('/trips/')[1].split('/services')[0]
    const { serviceId } = await request.json()

    // Verificar que el viaje pertenece al usuario
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
        userId,
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: "Viaje no encontrado o no autorizado" },
        { status: 404 }
      )
    }

    // Eliminar el servicio del viaje
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
    return NextResponse.json(
      { error: "Error al eliminar el servicio del viaje" },
      { status: 500 }
    )
  }
})
