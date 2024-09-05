import { MongoClient } from "mongodb"

const uri = process.env.MONGO_CONNECTION_STRING
let client: MongoClient | null = null
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error("Please add your Mongo URI to .env")
}

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)

    globalWithMongo._mongoClientPromise = client.connect()
  }

  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri)

  clientPromise = client.connect()
}

export default clientPromise
