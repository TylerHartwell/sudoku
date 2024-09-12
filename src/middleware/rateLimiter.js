const rateLimitMap = new Map()

let globalRateLimit = {
  count: 0,
  lastReset: Date.now()
}

export default function rateLimitMiddleware(handler) {
  return async (req, res) => {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip
    const perIpLimit = 5 // Limiting requests per minute per IP
    const globalLimit = 50 // Limiting total requests per minute globally
    const windowMs = 60 * 1000 // 1 minute
    const exceptionWindowMs = 60 * 60 * 1000 // 1 hour window for exceptions
    const exceptionLimit = 3 // Allow first 3 requests per IP within 1 hour to bypass global limit

    // Global rate limit logic
    if (Date.now() - globalRateLimit.lastReset > windowMs) {
      globalRateLimit.count = 0
      globalRateLimit.lastReset = Date.now()
    }

    // If this is the first time we're seeing this IP, initialize its data
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
        exceptionCount: 0,
        firstRequestTime: Date.now() // Track the first request time for the 1-hour exception window
      })
    }

    const ipData = rateLimitMap.get(ip)

    // Reset per-IP data if a minute has passed since the last reset
    if (Date.now() - ipData.lastReset > windowMs) {
      ipData.count = 0
      ipData.lastReset = Date.now()
    }

    // Check if the IP is still within its 1-hour exception window
    const withinExceptionWindow = Date.now() - ipData.firstRequestTime <= exceptionWindowMs

    // If the IP is within the exception window and has made fewer than 3 requests, bypass the global rate limit
    if (withinExceptionWindow && ipData.exceptionCount < exceptionLimit) {
      ipData.exceptionCount += 1 // Increment the exception counter for this IP
      ipData.count += 1 // Increment the per-IP counter
      return handler(req, res) // Allow the request without affecting the global limit
    }

    // If the global rate limit is hit and the IP is not within the exception, block the request
    if (globalRateLimit.count >= globalLimit) {
      return new Response("Global Rate Limit Exceeded", { status: 429 })
    }

    // If the per-IP limit is hit, block the request
    if (ipData.count >= perIpLimit) {
      return new Response("Per-IP Rate Limit Exceeded", { status: 429 })
    }

    // Increment both the global and per-IP request counts
    globalRateLimit.count += 1
    ipData.count += 1

    return handler(req, res)
  }
}
