import clientPromise from "./mongodb"

export async function initDb() {
  try {
    const client = await clientPromise
    const db = client.db("Cloud_Pipeline")

    const collection = db.collection("feasibility")
    await collection.find({}).toArray()
  } catch (e) {
    console.error(e)
  }
}
