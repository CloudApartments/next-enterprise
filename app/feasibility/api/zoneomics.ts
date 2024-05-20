"use client"
import useSWR from "swr"

export interface IAppProps {
  address: string
}

export default function useZoneomicsAPI(address: string) {
  const key = `https://api.zoneomics.com/v2/zoneDetail?api_key=8923262e5036c6a4e71b5105cc7e26e4e24d55d5&address=ß${encodeURIComponent(
    address
  )}`

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  const fetcher = (url: string): any =>
    fetch(url, { headers }).then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok")
      }
      return res.json()
    })

  const { data, error } = useSWR(key, fetcher)

  return { data, error, isLoading: !error && !data }
}
