"use server"
// pages/api/upsert.js
import clientPromise from "./mongodb"

export async function upsertParcels(doc: any) {
  try {
    const client = await clientPromise
    const db = client.db("Cloud_Pipeline")
    const collection = db.collection("feasibility")
    const filter = { id: doc.id }
    const update = { $set: doc }
    const options = { upsert: true }

    const result = await collection.updateOne(filter, update, options)
  } catch (e) {
    console.error(e)
  }
}

export async function upsertZoning(doc: any) {
  try {
    const client = await clientPromise
    const db = client.db("Cloud_Pipeline")
    const collection = db.collection("feasibility")
    const filter = { CloudId: doc.CloudId }
    const update = { $set: doc }
    const options = { upsert: true }

    const result = await collection.updateOne(filter, update, options)
  } catch (e) {
    console.error(e)
  }
}
