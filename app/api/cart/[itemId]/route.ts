import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth"

export const DELETE = withAuth(
  async (request: NextRequest, userId: string, { params }: { params: { itemId: string } }) => {
    try {
      const { itemId } = params

      // Verify cart item belongs to user
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          userId,
        },
      })

      if (!cartItem) {
        return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
      }

      await prisma.cartItem.delete({
        where: {
          id: itemId,
        },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error removing from cart:", error)
      return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
    }
  },
)
