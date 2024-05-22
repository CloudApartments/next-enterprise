import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { latitude, longitude, key } = req.query

  if (!latitude || !longitude || !key) {
    return res.status(400).json({ error: "Missing required parameters" })
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/elevation/json?locations=${latitude},${longitude}&key=${key}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (response.ok) {
      res.status(200).json(data)
    } else {
      res.status(response.status).json({ error: "Error fetching elevation data" })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
