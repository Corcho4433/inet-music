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
                            },
                        },
                        trip: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.error("Error fetching orders:", error)
        return NextResponse.json(
            { error: "Error al obtener el historial de compras" },
            { status: 500 }
        )
    }
}) 