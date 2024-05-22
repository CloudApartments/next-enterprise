// app/api/elevation/route.ts
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")
  const key = searchParams.get("key")

  if (!latitude || !longitude || !key) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/elevation/json?locations=${latitude},${longitude}&key=${key}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json({ error: "Error fetching elevation data" }, { status: response.status })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
