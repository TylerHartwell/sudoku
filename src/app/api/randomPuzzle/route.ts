import { NextRequest, NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import rateLimitMiddleware from "../../../middleware/rateLimiter"

export const dynamic = "force-dynamic"

const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    const client = await clientPromise
    const db = client.db("sudoku")
    const collection = db.collection("puzzles")

    const difficultyLevel = req.nextUrl.searchParams.get("difficulty")

    let difficultyFilter = {}
    if (difficultyLevel === "easy") {
      difficultyFilter = { difficulty: { $lt: 1.5 } }
    } else if (difficultyLevel === "medium") {
      difficultyFilter = { difficulty: { $gte: 1.5, $lt: 3.5 } }
    } else if (difficultyLevel === "hard") {
      difficultyFilter = { difficulty: { $gte: 3.5, $lt: 5 } }
    } else if (difficultyLevel === "diabolical") {
      difficultyFilter = { difficulty: { $gte: 5 } }
    }

    const [randomDocument] = await collection.aggregate([{ $match: difficultyFilter }, { $sample: { size: 1 } }]).toArray()

    if (randomDocument) {
      const response = NextResponse.json(randomDocument)
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")
      return response
    } else {
      return NextResponse.json({ error: "No puzzles" }, { status: 500 })
    }
  } catch (error) {
    return new Response(JSON.stringify(error))
  }
}

export const GET = rateLimitMiddleware(handler)
