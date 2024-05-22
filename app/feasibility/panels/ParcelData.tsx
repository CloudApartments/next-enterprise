import { useEffect, useState } from 'react'
import './parcelStyles.css'
import { Vector3 } from 'three'
import { upsertParcels } from 'app/api/lib/upserts'
import { useZustand } from 'app/api/zustand'
import useParcelAPI from "../api/lightboxParcel"
import useParcelAdjacentAPI from '../api/lightboxParcelAdjacent'
import { useElevationData } from '../api/useElevationData'
import { cleanJSON, convertToXYZ } from '../geoData/GeoUtils'
import JSONViewer from '../JSONViewer'

function ParcelData(props: { address: any; setMapCenter: any; CloudId: any }) {
  const { overlay, SET_MAIN_PARCEL, ADD_ADJACENT_PARCEL } = useZustand()
  const { address, setMapCenter, CloudId } = props
  const [tmpCenter, setTmpCenter] = useState<{ lat: number, lng: number }>()
  const [cleanData, setCleanData] = useState({ budgie: "sma,e" })
  const [parcelId, setParcelId] = useState('')

  const { data, error, isLoading } = useParcelAPI(address)


  const { data: adjacentData, error: adjacentError, isLoading: adjacentIsLoading } = useParcelAdjacentAPI(parcelId)
  const { elevationData } = useElevationData(
    tmpCenter?.lat,
    tmpCenter?.lng,
    'AIzaSyAExrPP2-yrt9vlXl52igXqdbAs_f3PID8'
  )

  useEffect(() => {
    if (data && !error && !isLoading) {
      const cleanedData = cleanJSON(data.parcels[0])
      setCleanData(cleanedData)
      console.log("elevationData", elevationData)

      // Convert WKT to GeoJSON
      const geojson = convertToXYZ(cleanedData.location.geometry.wkt)

      // Get the representative point or calculate the centroid
      const lat = cleanedData.location.representativePoint.latitude
      const lng = cleanedData.location.representativePoint.longitude
      setTmpCenter({ lat, lng })
      setMapCenter({ lat, lng })
      // Convert GeoJSON boundary to relative projected coordinates
      if (overlay && elevationData) {
        overlay.getMap().setCenter({ lat, lng, elevationData })
        // @ts-ignore
        const relativeBoundary = geojson?.coordinates[0].map(coord => {
          const yup = new Vector3()
          overlay.latLngAltitudeToVector3({ lng: coord[0], lat: coord[1], altitude: elevationData }, yup)
          console.log(yup)
          // yup.y = 0
          return yup
        })
        // const relativeBoundary = convertGeoJsonToRelative(geojson, wgs84, metricProj, referencePoint)
        SET_MAIN_PARCEL(relativeBoundary)
      }
      // Update data and map center
      cleanedData.CloudId = CloudId
      upsertParcels(cleanedData)
      setParcelId(cleanedData.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isLoading, overlay, elevationData])

  useEffect(() => {
    if (adjacentData && !adjacentError && !adjacentIsLoading) {
      // @ts-ignore
      adjacentData.parcels.forEach(parcel => {
        const cleanedData = cleanJSON(parcel)
        const geojson = convertToXYZ(cleanedData.location.geometry.wkt)

        // Get the representative point or calculate the centroid
        // const lat = cleanedData.location.representativePoint.latitude
        // const lng = cleanedData.location.representativePoint.longitude

        // Convert GeoJSON boundary to relative projected coordinates
        if (overlay) {
          // @ts-ignore
          const relativeBoundary = geojson?.coordinates[0].map(coord => {
            const yup = new Vector3()
            overlay.latLngAltitudeToVector3({ lng: coord[0], lat: coord[1] }, yup)
            console.log(yup)
            yup.y = 0
            return yup
          })
          // const relativeBoundary = convertGeoJsonToRelative(geojson, wgs84, metricProj, referencePoint)
          ADD_ADJACENT_PARCEL(relativeBoundary)
        }


        cleanedData.CloudId = CloudId
        upsertParcels(cleanedData)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjacentData, adjacentError, adjacentIsLoading])

  return (
    <div>
      {cleanData ? <JSONViewer data={cleanData} /> : <div>No Data</div>}
      {adjacentData && <div>ADJACENT PARCELS</div>}
      {
        // @ts-ignore
        adjacentData && adjacentData.parcels.map((parcel, index) => (
          <div key={index}><br /><hr /><br /> <JSONViewer data={cleanJSON(parcel)} /></div>
        ))}
    </div>
  )
}

export default ParcelData
