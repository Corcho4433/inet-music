import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"
import { Decimal } from "@prisma/client/runtime/library"

export const POST = withAuth(async (request: Request, userId: string) => {
    try {
        // Obtener los items del carrito del usuario
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId,
            },
            include: {
                package: true,
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

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: "El carrito está vacío" },
                { status: 400 }
            )
        }

        // Calcular el total de la orden
        let total = new Decimal(0)
        for (const item of cartItems) {
            if (item.package) {
                total = total.add(item.package.price)
            }
            if (item.trip) {
                const tripTotal = item.trip.services.reduce(
                    (acc, service) => acc.add(service.service.price),
                    new Decimal(0)
                )
                total = total.add(tripTotal)
            }
        }

        // Crear la orden
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                items: {
                    create: cartItems.map((item) => ({
                        packageId: item.packageId,
                        tripId: item.tripId,
                        itemType: item.itemType,
                        price: item.package?.price || 
                            new Decimal(item.trip?.services.reduce(
                                (acc, service) => acc.add(service.service.price),
                                new Decimal(0)
                            ) || 0),
                        metadata: {
                            name: item.package?.name || item.trip?.name || "",
                            originalPrice: item.package?.price || 
                                new Decimal(item.trip?.services.reduce(
                                    (acc, service) => acc.add(service.service.price),
                                    new Decimal(0)
                                ) || 0),
                        },
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        package: true,
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
                },
            },
        })

        // Limpiar el carrito
        await prisma.cartItem.deleteMany({
            where: {
                userId,
            },
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error("Error processing checkout:", error)
        return NextResponse.json(
            { error: "Error al procesar el checkout" },
            { status: 500 }
        )
    }
}) 