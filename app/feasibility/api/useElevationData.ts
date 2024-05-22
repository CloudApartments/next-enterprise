import useSWR from "swr"

export function useElevationData(
  latitude: number | undefined,
  longitude: number | undefined,
  googleApiKey = "AIzaSyAExrPP2-yrt9vlXl52igXqdbAs_f3PID8"
) {
  const key =
    latitude && longitude ? `/api/elevation?latitude=${latitude}&longitude=${longitude}&key=${googleApiKey}` : null

  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok")
      }
      return res.json()
    })

  const { data, error } = useSWR(key, fetcher)

  return {
    // @ts-ignore
    elevationData: data?.results[0]?.elevation,
    isLoading: !error && !data,
    isError: error,
  }
}
