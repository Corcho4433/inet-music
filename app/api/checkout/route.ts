import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const POST = withAuth(async (request: Request, userId: string) => {
    try {
        // Obtener items del carrito
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId,
            },
            include: {
                package: {
                    select: {
                        name: true,
                        price: true,
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

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: "El carrito está vacío" },
                { status: 400 }
            )
        }

        // Calcular total y preparar items de la orden
        let total = 0
        const orderItems = cartItems.map((item) => {
            let price = 0
            let name = ""

            if (item.package) {
                price = Number(item.package.price)
                name = item.package.name
            } else if (item.trip) {
                // Sumar precios de todos los servicios del viaje
                price = item.trip.services.reduce(
                    (acc, service) => acc + Number(service.service.price),
                    0
                )
                name = item.trip.name
            }

            total += price * item.quantity

            return {
                itemType: item.itemType,
                packageId: item.packageId,
                tripId: item.tripId,
                quantity: item.quantity,
                price,
                metadata: {
                    name,
                    originalPrice: price,
                },
            }
        })

        // Crear la orden
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
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
            { error: "Error al procesar el pago" },
            { status: 500 }
        )
    }
}) 