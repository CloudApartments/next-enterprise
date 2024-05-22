"use client"
import { useEffect, useState } from 'react'
import { upsertZoning } from 'app/api/lib/upserts'
import useZoneomicsAPI from '../api/zoneomics'
import { cleanJSON } from '../geoData/GeoUtils'
import JSONViewer from '../JSONViewer'



export default function ZoneData(props: any) {
  const { address, CloudId } = props
  const [cleanData, setCleanData] = useState({ budgie: "snake" })
  const { data, error, isLoading } = useZoneomicsAPI(address)
  useEffect(() => {
    if (data && !error && !isLoading) {
      const cleanedData = cleanJSON(data).data
      setCleanData(cleanedData)
      cleanedData.CloudId = CloudId
      upsertZoning(cleanedData)
    }
  }, [CloudId, data, error, isLoading])



  return (<div>
    {cleanData ? <JSONViewer data={cleanData} /> : <div>No Data</div>}
  </div>)
}
