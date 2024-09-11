const rateLimitMap = new Map()

export default function rateLimitMiddleware(handler) {
  return async (req, res) => {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip
    const limit = 10 // Limiting requests to 10 per minute per IP
    const windowMs = 60 * 1000 // 1 minute

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now()
      })
    }

    const ipData = rateLimitMap.get(ip)

    if (Date.now() - ipData.lastReset > windowMs) {
      ipData.count = 0
      ipData.lastReset = Date.now()
    }

    if (ipData.count >= limit) {
      return new Response("Too Many Requests", { status: 429 })
    }

    ipData.count += 1

    return handler(req, res)
  }
}
