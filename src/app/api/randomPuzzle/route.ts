import { NextRequest, NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const client = await clientPromise
    const db = client.db("sudoku")
    const collection = db.collection("puzzles")

    const count = await collection.countDocuments()
    const randomIndex = Math.floor(Math.random() * count)
    const randomDocument = await collection.find().skip(randomIndex).limit(1).toArray()

    if (randomDocument.length > 0) {
      const response = NextResponse.json(randomDocument[0])
      response.headers.set("Cache-Control", "no-store")
      return response
    } else {
      return NextResponse.json({ error: "No puzzles" }, { status: 500 })
    }
  } catch (error) {
    return new Response(JSON.stringify(error))
  }
}
