import type { NextRequest } from "next/server"

// Simple auth - in production, use proper authentication
export function getCurrentUser(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "user1"
  return userId
}

export function withAuth(handler: (req: NextRequest, userId: string) => Promise<Response>) {
  return async (req: NextRequest) => {
    const userId = getCurrentUser(req)
    return handler(req, userId)
  }
}
