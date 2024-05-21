import { useEffect, useState } from 'react'
import './parcelStyles.css'
import { upsertParcels } from 'app/api/lib/upserts'
import { useZustand } from 'app/api/zustand'
import useParcelAPI from "../api/lightboxParcel"
import useParcelAdjacentAPI from '../api/lightboxParcelAdjacent'
import { convertGeoJsonToRelative, convertToXYZ, cleanJSON, wgs84, metricProj } from '../geoData/GeoUtils'
import JSONViewer from '../JSONViewer'
import { Vector3 } from 'three'

function ParcelData(props) {
  const { overlay, SET_MAIN_PARCEL } = useZustand()
  const { address, setMapCenter, CloudId } = props
  const [cleanData, setCleanData] = useState({ budgie: "sma,e" })
  const [parcelId, setParcelId] = useState(null)
  const { data, error, isLoading } = useParcelAPI(address)
  const { data: adjacentData, error: adjacentError, isLoading: adjacentIsLoading } = useParcelAdjacentAPI(parcelId)

  useEffect(() => {
    if (data && !error && !isLoading) {
      const cleanedData = cleanJSON(data.parcels[0])
      setCleanData(cleanedData)

      // Convert WKT to GeoJSON
      const geojson = convertToXYZ(cleanedData.location.geometry.wkt)

      // Get the representative point or calculate the centroid
      const lat = cleanedData.location.representativePoint.latitude
      const lng = cleanedData.location.representativePoint.longitude
      const referencePoint = [lng, lat]

      // Convert GeoJSON boundary to relative projected coordinates
      if (overlay) {

        const relativeBoundary = geojson?.coordinates[0].map(coord => {
          const yup = new Vector3()
          overlay.latLngAltitudeToVector3({ lng: coord[0], lat: coord[1] }, yup)
          console.log(yup)
          yup.y = 0
          return yup
        })
        // const relativeBoundary = convertGeoJsonToRelative(geojson, wgs84, metricProj, referencePoint)
        SET_MAIN_PARCEL(relativeBoundary)
      }
      // Update data and map center
      cleanedData.CloudId = CloudId
      upsertParcels(cleanedData)
      setMapCenter({ lat, lng })
      setParcelId(cleanedData.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isLoading, overlay])

  useEffect(() => {
    if (adjacentData && !adjacentError && !adjacentIsLoading) {
      adjacentData.parcels.forEach(parcel => {
        const cleanedData = cleanJSON(parcel)
        const geojson = convertToXYZ(cleanedData.location.geometry.wkt)

        // Get the representative point or calculate the centroid
        const lat = cleanedData.location.representativePoint.latitude
        const lng = cleanedData.location.representativePoint.longitude
        const referencePoint = [lng, lat]

        // Convert GeoJSON boundary to relative projected coordinates
        const relativeBoundary = convertGeoJsonToRelative(geojson, wgs84, metricProj, referencePoint)
        console.log(relativeBoundary)


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
      {adjacentData && adjacentData.parcels.map((parcel, index) => (
        <div key={index}><br /><hr /><br /> <JSONViewer data={cleanJSON(parcel)} /></div>
      ))}
    </div>
  )
}

export default ParcelData
