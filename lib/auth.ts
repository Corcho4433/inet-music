import type { NextRequest } from "next/server"

// Simple auth - in production, use proper authentication
export function getCurrentUser(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "user1"
  return userId
}

type HandlerWithParams<T extends Record<string, string> = Record<string, string>> = (
  req: NextRequest,
  userId: string,
  context: { params: T }
) => Promise<Response>

export function withAuth<T extends Record<string, string> = Record<string, string>>(
  handler: HandlerWithParams<T>
) {
  return async (req: NextRequest, context: { params: T }) => {
    const userId = getCurrentUser(req)
    return handler(req, userId, context)
  }
}
