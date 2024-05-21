import useSWR from "swr"

export interface IAppProps {
  address: string
}

export default function useParcelAPI(address: string) {
  const key = `https://api.lightboxre.com/v1/parcels/address?text=${encodeURIComponent(address)}`

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": "n28w7b1X5ceGiUu1G3IGnEG7EJOGkTQU",
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
