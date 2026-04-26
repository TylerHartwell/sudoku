import { NextResponse } from "next/server"
import { isIP } from "node:net"
import clientPromise from "../lib/mongodb"

const WINDOW_MS = 60 * 1000
const PER_IP_LIMIT = 5
const GLOBAL_LIMIT = 50

let indexSetupPromise = null

async function getRateLimitCollection() {
  const client = await clientPromise
  const collection = client.db("sudoku").collection("rateLimits")

  if (!indexSetupPromise) {
    indexSetupPromise = Promise.all([
      collection.createIndex({ key: 1, windowStart: 1 }, { unique: true }),
      collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]).catch((error) => {
      indexSetupPromise = null
      throw error
    })
  }

  await indexSetupPromise

  return collection
}

function isValidIp(ip) {
  return typeof ip === "string" && isIP(ip) !== 0
}

function getClientIp(req) {
  if (isValidIp(req.ip)) {
    return req.ip
  }

  const trustProxyHeaders = process.env.TRUST_PROXY_HEADERS === "true"

  if (!trustProxyHeaders) {
    return "unknown"
  }

  const candidates = [
    req.headers.get("cf-connecting-ip"),
    req.headers.get("true-client-ip"),
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ]

  for (const candidate of candidates) {
    if (isValidIp(candidate)) {
      return candidate
    }
  }

  return "unknown"
}

async function incrementAndGetCount(collection, key, windowStart, expiresAt) {
  const result = await collection.findOneAndUpdate(
    { key, windowStart },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  )

  return result?.count ?? 0
}

export default function rateLimitMiddleware(handler) {
  return async (req, res) => {
    try {
      const now = Date.now()
      const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS
      const expiresAt = new Date(windowStart + WINDOW_MS)
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowStart + WINDOW_MS - now) / 1000),
      )
      const collection = await getRateLimitCollection()
      const routeKey = req.nextUrl?.pathname ?? "global"

      const globalCount = await incrementAndGetCount(
        collection,
        `global:${routeKey}`,
        windowStart,
        expiresAt,
      )

      if (globalCount > GLOBAL_LIMIT) {
        return new NextResponse("Global Rate Limit Exceeded", {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
          },
        })
      }

      const ip = getClientIp(req)
      const ipCount = await incrementAndGetCount(
        collection,
        `ip:${ip}:${routeKey}`,
        windowStart,
        expiresAt,
      )

      if (ipCount > PER_IP_LIMIT) {
        return new NextResponse("Per-IP Rate Limit Exceeded", {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
          },
        })
      }

      return handler(req, res)
    } catch (error) {
      console.error("rateLimitMiddleware error:", error)

      // Fail open to keep API available if the limiter backend is unavailable.
      return handler(req, res)
    }
  }
}
